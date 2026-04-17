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
  // 대시보드와 같은 오리진에서만 허용 (타 사이트 차단)
  const origin = request.headers.get('Origin') || '';
  const selfOrigin = new URL(request.url).origin;
  const cors = {
    'Access-Control-Allow-Origin': origin === selfOrigin ? origin : selfOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }

  const dashPass = await env.KV.get('dashboard_password');

  // POST /api/login — 비밀번호 확인 (인증 전 허용)
  if (path === '/api/login' && request.method === 'POST') {
    try {
      const { password } = await request.json();
      if (dashPass && password === dashPass) {
        return json({ ok: true, token: dashPass }, 200, cors);
      }
      return json({ ok: false, error: 'Invalid password' }, 401, cors);
    } catch {
      return json({ ok: false }, 400, cors);
    }
  }

  // 간단한 인증 (대시보드 비밀번호)
  const authHeader = request.headers.get('Authorization');
  if (dashPass && authHeader !== `Bearer ${dashPass}`) {
    return json({ error: 'Unauthorized' }, 401, cors);
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

    // PUT /api/ai-usage — AI 사용량 수동 설정
    if (path === '/api/ai-usage' && request.method === 'PUT') {
      const body = await request.json();
      const month = new Date().toISOString().slice(0, 7);
      await env.KV.put(`ai_usage:${month}`, JSON.stringify(body));
      return json({ ok: true }, 200, cors);
    }

    // GET /api/ai-usage — AI 사용량 조회
    if (path === '/api/ai-usage' && request.method === 'GET') {
      const month = new Date().toISOString().slice(0, 7); // "2026-04"
      const usage = JSON.parse(await env.KV.get(`ai_usage:${month}`) || '{"requests":0,"inputTokens":0,"outputTokens":0,"cost":0}');
      return json(usage, 200, cors);
    }

    // PUT /api/logs/country — 로그 국가 수정
    if (path === '/api/logs/country' && request.method === 'POST') {
      const { index, country } = await request.json();
      const logs = await getRecentLogs(env);
      if (logs[index]) { logs[index].country = country; await updateLogs(env, logs); }
      return json({ ok: true }, 200, cors);
    }

    // POST /api/reset-patient — 환자 KV 데이터 리셋
    if (path === '/api/reset-patient' && request.method === 'POST') {
      const { senderId } = await request.json();
      if (senderId) {
        await Promise.all([
          env.KV.delete(`conv:${senderId}`),
          env.KV.delete(`country:${senderId}`),
          env.KV.delete(`concern:${senderId}`),
          env.KV.delete(`purpose:${senderId}`),
          env.KV.delete(`awaiting_country:${senderId}`),
          env.KV.delete(`awaiting_concern:${senderId}`),
          env.KV.delete(`paused:${senderId}`),
        ]);
      }
      return json({ ok: true }, 200, cors);
    }

    // POST /api/instagram/refresh — 인스타 캐시 삭제
    if (path === '/api/instagram/refresh' && request.method === 'POST') {
      await env.KV.delete('cache:ig_stats');
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

    // POST /api/logs/review — 로그 reviewed 토글 (단일 또는 벌크)
    if (path === '/api/logs/review' && request.method === 'POST') {
      const body = await request.json();
      const logs = await getRecentLogs(env);
      if (body.username !== undefined) {
        // 벌크: username 기반으로 전체 처리
        logs.forEach(l => { if ((l.username || l.senderId) === body.username) l.reviewed = body.reviewed; });
      } else if (body.index !== undefined) {
        // 단일 index
        if (logs[body.index]) logs[body.index].reviewed = body.reviewed;
      }
      await updateLogs(env, logs);
      return json({ ok: true }, 200, cors);
    }

    // DELETE /api/logs — 로그 삭제
    if (path === '/api/logs/delete' && request.method === 'POST') {
      const { index } = await request.json();
      const logs = await getRecentLogs(env);
      if (index >= 0 && index < logs.length) { logs.splice(index, 1); await updateLogs(env, logs); }
      return json({ ok: true }, 200, cors);
    }

    // POST /api/logs/edit — 로그 필드 수정
    if (path === '/api/logs/edit' && request.method === 'POST') {
      const { index, field, value } = await request.json();
      const logs = await getRecentLogs(env);
      if (logs[index] && ['tag','country','replied','received'].includes(field)) { logs[index][field] = value; await updateLogs(env, logs); }
      return json({ ok: true }, 200, cors);
    }

    // POST /api/logs/tag — 로그 태그 수정
    if (path === '/api/logs/tag' && request.method === 'POST') {
      const { index, tag } = await request.json();
      const logs = await getRecentLogs(env);
      if (logs[index]) { logs[index].tag = tag; await updateLogs(env, logs); }
      return json({ ok: true }, 200, cors);
    }

    // POST /api/reply — 직접 답장 전송
    if (path === '/api/reply' && request.method === 'POST') {
      const { senderId, message, username } = await request.json();
      const url = `https://graph.instagram.com/v21.0/me/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.META_PAGE_TOKEN}` },
        body: JSON.stringify({ recipient: { id: senderId }, message: { text: message } }),
      });
      if (!res.ok) return json({ error: await res.text() }, 500, cors);
      // 같은 사용자의 새 로그로 추가 (대화 흐름 유지)
      const logs = await getRecentLogs(env);
      const country = logs.find(l => l.username === username || l.senderId === senderId)?.country || '';
      logs.unshift({ senderId, username: username || '', received: '', replied: message, timestamp: Date.now(), createdAt: new Date().toISOString(), tag: 'direct', country, reviewed: true });
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

    // POST /api/ai-video-recommendations — AI가 국가/고민 분석해서 인스타 영상 아이디어 추천
    if (path === '/api/ai-video-recommendations' && request.method === 'POST') {
      const body = await request.json();
      const { countries = {}, concerns = {}, force = false } = body;

      // 24시간 캐시 — force=false면 캐시만 확인, 없으면 비어있는 응답 반환 (API 호출 안함)
      const cacheKey = 'cache:video_recs';
      if (!force) {
        const cached = await env.KV.get(cacheKey, 'json');
        if (cached && cached._cachedAt && (Date.now() - cached._cachedAt) < 86400000) {
          return json({ ...cached, cached: true }, 200, cors);
        }
        return json({ ideas: null, cached: false, empty: true }, 200, cors);
      }

      const cfg = await getConfig(env);
      const apiKey = cfg.claudeApiKey || env.CLAUDE_API_KEY;
      const model = cfg.claudeModel || 'claude-haiku-4-5-20251001';
      if (!apiKey) return json({ error: 'Claude API key not configured in Settings' }, 400, cors);

      // 월간 한도 체크
      const month = new Date().toISOString().slice(0, 7);
      const usage = JSON.parse(await env.KV.get(`ai_usage:${month}`) || '{"requests":0,"inputTokens":0,"outputTokens":0,"cost":0}');
      if (cfg.claudeMonthlyLimit && usage.cost >= cfg.claudeMonthlyLimit) {
        return json({ error: 'Monthly AI limit reached' }, 429, cors);
      }

      const topCountries = Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 8);
      const topConcerns = Object.entries(concerns).sort((a, b) => b[1] - a[1]).slice(0, 8);
      if (!topCountries.length && !topConcerns.length) {
        return json({ error: 'Not enough patient data to analyze yet.' }, 400, cors);
      }

      const prompt = `You are a social media strategist for Dr. Sean, a Korean dermatologist attracting international patients via Instagram DMs.

Real patient data from recent DM inquiries:

Top patient countries:
${topCountries.map(([c, n]) => `- ${c}: ${n} patients`).join('\n') || '- (none yet)'}

Top skin concerns mentioned:
${topConcerns.map(([c, n]) => `- ${c}: ${n} mentions`).join('\n') || '- (none yet)'}

Suggest 5 Instagram Reels video ideas that will attract MORE patients like these. Think about:
- Skin concerns trending in the data that should be addressed on camera
- Cultural/regional dynamics from the top countries (K-beauty interest, Western anti-aging, Southeast Asian skin type concerns, medical tourism, etc.)
- What content would make viewers actually DM the clinic

For each idea return:
- title: catchy Instagram Reel title in English, max 60 chars
- hook: opening 2–3 second line viewers see first, max 80 chars
- target: which country/concern segment it targets
- format: Reel type (Before/After, Tutorial, Mythbuster, Day-in-life, Treatment explainer, Patient story, etc.)
- reason: 1 sentence explaining why this will work, grounded in the data above

Return ONLY a JSON array. No markdown, no code fences, no extra text.
[{"title":"...","hook":"...","target":"...","format":"...","reason":"..."}]`;

      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            max_tokens: 1500,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error('Claude API error:', errText);
          return json({ error: 'AI request failed' }, 500, cors);
        }

        const data = await res.json();
        let text = (data.content?.[0]?.text || '').trim();
        text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

        let ideas;
        try {
          ideas = JSON.parse(text);
        } catch (e) {
          const match = text.match(/\[[\s\S]*\]/);
          if (match) ideas = JSON.parse(match[0]);
          else return json({ error: 'AI returned invalid format' }, 500, cors);
        }
        if (!Array.isArray(ideas)) return json({ error: 'AI returned invalid format' }, 500, cors);

        // 토큰 사용량 추적
        const inTok = data.usage?.input_tokens || 0;
        const outTok = data.usage?.output_tokens || 0;
        const prices = { 'claude-haiku-4-5-20251001': [0.80, 4], 'claude-sonnet-4-6': [3, 15], 'claude-opus-4-6': [15, 75] };
        const [inPrice, outPrice] = prices[model] || [0.80, 4];
        const cost = (inTok * inPrice / 1e6) + (outTok * outPrice / 1e6);
        usage.requests++;
        usage.inputTokens += inTok;
        usage.outputTokens += outTok;
        usage.cost = Math.round((usage.cost + cost) * 1e6) / 1e6;
        await env.KV.put(`ai_usage:${month}`, JSON.stringify(usage));

        const result = { ideas, _cachedAt: Date.now(), model };
        await env.KV.put(cacheKey, JSON.stringify(result), { expirationTtl: 172800 });
        return json({ ...result, cached: false }, 200, cors);
      } catch (err) {
        console.error('Video recommendations error:', err);
        return json({ error: err.message || 'Unknown error' }, 500, cors);
      }
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
    // 전체 게시물 (페이지네이션으로 모두 가져오기)
    let allPosts = [];
    let nextUrl = `https://graph.instagram.com/v21.0/me/media?fields=id,caption,like_count,comments_count,timestamp,media_type,thumbnail_url,media_url,permalink&limit=200`;
    while (nextUrl && allPosts.length < 500) {
      const mediaRes = await fetch(nextUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!mediaRes.ok) break;
      const m = await mediaRes.json();
      allPosts = allPosts.concat(m.data || []);
      nextUrl = m.paging?.next || null;
    }
    if (allPosts.length) {
      const recentPosts = allPosts;
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
          permalink: p.permalink || '',
          caption: (p.caption || '').substring(0, 300),
          likes: p.like_count || 0,
          comments: p.comments_count || 0,
          views,
          date: p.timestamp,
          type: p.media_type,
          thumbnail: p.thumbnail_url || '',
          media: p.media_url || '',
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
