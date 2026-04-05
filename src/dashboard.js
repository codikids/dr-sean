/**
 * 관리 대시보드 서빙 + API
 */

import { getConfig, saveConfig, getRecentLogs, updateLogs, getPatientData, savePatientData } from './storage.js';
import { DASHBOARD_HTML } from './dashboard-html.js';
import { LOGIN_HTML } from './login-html.js';

/** 로그인 페이지 서빙 */
export function serveLogin() {
  return new Response(LOGIN_HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

/** 대시보드 페이지 서빙 */
export function serveDashboard(env) {
  return new Response(DASHBOARD_HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

/** 대시보드 API 라우터 */
export async function handleDashboardAPI(request, env, path) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }

  // 간단한 인증 (대시보드 비밀번호)
  const authHeader = request.headers.get('Authorization');
  const dashPass = await env.KV.get('dashboard_password');
  if (dashPass && authHeader !== `Bearer ${dashPass}`) {
    // 비밀번호 미설정 시 인증 스킵 (초기 셋업용)
    if (dashPass) {
      return json({ error: 'Unauthorized' }, 401, cors);
    }
  }

  try {
    // GET /api/config — 설정 불러오기
    if (path === '/api/config' && request.method === 'GET') {
      const config = await getConfig(env);
      return json(config, 200, cors);
    }

    // PUT /api/config — 설정 저장
    if (path === '/api/config' && request.method === 'PUT') {
      const body = await request.json();
      await saveConfig(env, body);
      return json({ ok: true }, 200, cors);
    }

    // GET /api/logs — DM 로그 조회
    if (path === '/api/logs' && request.method === 'GET') {
      const logs = await getRecentLogs(env);
      return json(logs, 200, cors);
    }

    // POST /api/toggle — 봇 ON/OFF
    if (path === '/api/toggle' && request.method === 'POST') {
      const current = await env.KV.get('bot_enabled');
      const next = current === 'false' ? 'true' : 'false';
      await env.KV.put('bot_enabled', next);
      return json({ enabled: next === 'true' }, 200, cors);
    }

    // GET /api/status — 봇 상태
    if (path === '/api/status' && request.method === 'GET') {
      const enabled = await env.KV.get('bot_enabled');
      return json({ enabled: enabled !== 'false' }, 200, cors);
    }

    // POST /api/password — 비밀번호 설정
    if (path === '/api/password' && request.method === 'POST') {
      const { password } = await request.json();
      await env.KV.put('dashboard_password', password);
      return json({ ok: true }, 200, cors);
    }

    // POST /api/logs/review — 로그 reviewed 토글
    if (path === '/api/logs/review' && request.method === 'POST') {
      const { index, reviewed } = await request.json();
      const logs = await getRecentLogs(env);
      if (logs[index]) { logs[index].reviewed = reviewed; await updateLogs(env, logs); }
      return json({ ok: true }, 200, cors);
    }

    // POST /api/reply — 직접 답장 전송
    if (path === '/api/reply' && request.method === 'POST') {
      const { senderId, message } = await request.json();
      const url = `https://graph.instagram.com/v21.0/me/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.META_PAGE_TOKEN}` },
        body: JSON.stringify({ recipient: { id: senderId }, message: { text: message } }),
      });
      if (!res.ok) return json({ error: await res.text() }, 500, cors);
      // 로그에 직접 답장 기록
      const logs = await getRecentLogs(env);
      logs.unshift({ senderId, username: '', received: '[Direct reply from dashboard]', replied: message, timestamp: Date.now(), createdAt: new Date().toISOString(), tag: 'direct', reviewed: true });
      if (logs.length > 400) logs.splice(400);
      await updateLogs(env, logs);
      return json({ ok: true }, 200, cors);
    }

    // GET /api/patients — 환자 데이터 (VIP, 메모, 일시정지)
    if (path === '/api/patients' && request.method === 'GET') {
      const data = await getPatientData(env);
      return json(data, 200, cors);
    }

    // PUT /api/patients — 환자 데이터 업데이트
    if (path === '/api/patients' && request.method === 'PUT') {
      const body = await request.json();
      await savePatientData(env, body);
      return json({ ok: true }, 200, cors);
    }

    // GET /api/instagram — 인스타 통계
    if (path === '/api/instagram' && request.method === 'GET') {
      const stats = await getInstagramStats(env);
      return json(stats, 200, cors);
    }

    return json({ error: 'Not Found' }, 404, cors);
  } catch (err) {
    console.error('API error:', err);
    return json({ error: err.message }, 500, cors);
  }
}

/** Instagram 프로필 + 게시물 통계 (1시간 캐싱) */
async function getInstagramStats(env) {
  // 캐시 확인 (1시간)
  try {
    const cached = await env.KV.get('cache:ig_stats', 'json');
    if (cached && cached._cachedAt && (Date.now() - cached._cachedAt) < 3600000) {
      return cached;
    }
  } catch(e) {}
  const token = env.META_PAGE_TOKEN;
  const stats = { followers: 0, mediaCount: 0, posts: [], totalLikes: 0, totalComments: 0 };
  try {
    // 프로필 정보
    const profileRes = await fetch(
      `https://graph.instagram.com/v21.0/me?fields=followers_count,media_count,username,name,profile_picture_url`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    if (profileRes.ok) {
      const p = await profileRes.json();
      stats.followers = p.followers_count || 0;
      stats.mediaCount = p.media_count || 0;
      stats.username = p.username || '';
      stats.name = p.name || '';
      stats.profilePic = p.profile_picture_url || '';
    }
    // 최근 게시물 + 좋아요/댓글
    const mediaRes = await fetch(
      `https://graph.instagram.com/v21.0/me/media?fields=id,caption,like_count,comments_count,timestamp,media_type,thumbnail_url,media_url&limit=50`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    if (mediaRes.ok) {
      const m = await mediaRes.json();
      // 최근 30일 게시물만 필터
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const recentPosts = (m.data || []).filter(p => p.timestamp >= thirtyDaysAgo);
      // 각 게시물별로 인사이트(조회수) 가져오기
      const postsWithInsights = await Promise.all(recentPosts.map(async (p) => {
        let views = 0;
        try {
          const insightRes = await fetch(
            `https://graph.instagram.com/v21.0/${p.id}/insights?metric=views`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (insightRes.ok) {
            const ins = await insightRes.json();
            views = ins.data?.[0]?.values?.[0]?.value || 0;
          }
        } catch(e) {}
        return {
          caption: (p.caption || '').substring(0, 80),
          likes: p.like_count || 0,
          comments: p.comments_count || 0,
          views,
          date: p.timestamp,
          type: p.media_type,
        };
      }));
      stats.posts = postsWithInsights;
      stats.totalLikes = stats.posts.reduce((s, p) => s + p.likes, 0);
      stats.totalComments = stats.posts.reduce((s, p) => s + p.comments, 0);
      stats.totalViews = stats.posts.reduce((s, p) => s + p.views, 0);
    }
  } catch (e) { console.error('Instagram stats error:', e); }

  // 캐시 저장 (1시간)
  try {
    stats._cachedAt = Date.now();
    await env.KV.put('cache:ig_stats', JSON.stringify(stats), { expirationTtl: 7200 });
  } catch(e) {}

  return stats;
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}
