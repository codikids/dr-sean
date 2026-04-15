/**
 * Instagram Webhook — 수신 & 검증
 */

import { generateReply } from './reply.js';
import { logMessage, getConfig, isPatientPaused } from './storage.js';

/** GET /webhook — Meta 웹훅 검증 */
export function verifyWebhook(request, env) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === env.META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

/** Meta HMAC-SHA256 서명 검증 */
async function verifySignature(rawBody, signatureHeader, appSecret) {
  if (!signatureHeader || !appSecret) return false;
  const expected = signatureHeader.startsWith('sha256=') ? signatureHeader.slice(7) : signatureHeader;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(appSecret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  const actual = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  // 타이밍 공격 방지용 상수시간 비교
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

/** POST /webhook — DM 수신 처리 */
export async function handleWebhook(request, env) {
  try {
    // 서명 검증 — Meta App Secret 설정돼 있으면 필수
    const rawBody = await request.text();
    if (env.META_APP_SECRET) {
      const sig = request.headers.get('x-hub-signature-256');
      const ok = await verifySignature(rawBody, sig, env.META_APP_SECRET);
      if (!ok) {
        console.warn('Webhook signature verification failed');
        return new Response('Forbidden', { status: 403 });
      }
    }

    // 봇 ON/OFF 확인
    const enabled = await env.KV.get('bot_enabled');
    if (enabled === 'false') {
      return new Response('OK', { status: 200 });
    }

    const body = JSON.parse(rawBody);

    // Instagram 이벤트만 처리
    if (body.object !== 'instagram') {
      return new Response('OK', { status: 200 });
    }

    for (const entry of body.entry || []) {
      // ── 댓글 자동 답글 처리 ──
      for (const change of entry.changes || []) {
        if (change.field === 'comments' && change.value) {
          await handleComment(change.value, env);
        }
      }

      // ── DM 처리 ──
      for (const event of entry.messaging || []) {
        // 텍스트 메시지만 처리 (에코 방지)
        if (event.message?.is_echo) continue;
        if (!event.message?.text) continue;

        const senderId = event.sender.id;
        const text = event.message.text;
        const timestamp = event.timestamp;

        // 유저 프로필 가져오기 (username + 팔로우 여부)
        const profile = await getUserProfile(senderId, env);

        // 테스트 계정 체크
        const TEST_USERS = ['ev_ssunny'];
        const isTestUser = TEST_USERS.includes(profile.username);

        // 팔로우 안 한 사람 → 팔로우 안내 + "팔로우 완료" 버튼
        if (!profile.is_follower) {
          await sendMessage(senderId, "Hey there! 😊 Quick heads-up — Instagram only shows my replies at the top of your inbox if you're following me. Mind giving @dr.skinsource a follow? That way you'll actually see my messages and we can chat properly!", env);
          await sendMessage(senderId, "Tap below once you've followed!", env, ["I've followed! ✨"]);
          if (!isTestUser) await logMessage(env, { senderId, username: profile.username || '', received: text, replied: '[Follow request - not following]', timestamp });
          continue;
        }

        // 이모지/스토리 리액션만 온 경우 → AI 답변 안 함, 로그만 기록
        const isEmojiOnly = /^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\p{Emoji_Component}\s]+$/u.test(text) && text.trim().length <= 8;
        if (isEmojiOnly) {
          if (!isTestUser) await logMessage(env, { senderId, username: profile.username || '', received: text, replied: '[Emoji/reaction — no reply]', timestamp, reviewed: true });
          continue;
        }

        // 봇 일시정지 환자 → 답장 안 보냄 (로그만 기록)
        if (profile.username && await isPatientPaused(env, profile.username)) {
          if (!isTestUser) await logMessage(env, { senderId, username: profile.username, received: text, replied: '[Bot paused — waiting for manual reply]', timestamp, tag: 'paused' });
          continue;
        }

        // 중복 답변 방지 — 딜레이 중 새 메시지 오면 큐에 쌓기
        const lockKey = `replying:${senderId}`;
        const isReplying = await env.KV.get(lockKey);
        if (isReplying) {
          // 이미 답변 생성 중 → 큐에 쌓아두기 (나중에 일괄 처리)
          const queueKey = `queue:${senderId}`;
          const queue = JSON.parse(await env.KV.get(queueKey) || '[]');
          queue.push({ text, timestamp, username: profile.username || '', name: profile.name || '' });
          await env.KV.put(queueKey, JSON.stringify(queue), { expirationTtl: 300 });
          continue;
        }
        await env.KV.put(lockKey, 'true', { expirationTtl: 300 });

        // 답변 생성 (reply + metadata + quickReplies + followUp)
        const result = await generateReply(text, senderId, env, profile.username);
        const reply = result.reply;
        const metadata = result.metadata || {};
        const quickReplies = result.quickReplies || null;

        // 자연스러운 답변 딜레이 (Settings에서 조정 가능)
        const cfg = await getConfig(env);
        const dShort = (cfg.delayShort ?? 30) * 1000;
        const dLong = (cfg.delayLong ?? 120) * 1000;
        const dMed = (cfg.delayMedium ?? 60) * 1000;
        const delay = dShort === 0 ? 0 : Math.min(dLong, Math.max(dShort, reply.length * (dMed/100)));
        if (delay > 0) await new Promise(r => setTimeout(r, delay));

        // Instagram API로 답장 전송
        await sendMessage(senderId, reply, env, quickReplies);

        // followUp 메시지 (국가 질문 등 — 짧은 메시지 + 버튼)
        if (result.followUp) {
          await sendMessage(senderId, result.followUp.text, env, result.followUp.quickReplies);
        }

        // 로그 저장 (테스트 유저 제외)
        if (!isTestUser) await logMessage(env, {
          senderId,
          username: profile.username || '',
          name: profile.name || '',
          country: metadata.country || '',
          tag: metadata.tag || '',
          received: text,
          replied: reply,
          timestamp,
        });

        // ── 큐에 쌓인 메시지 일괄 처리 ──
        const queueKey = `queue:${senderId}`;
        const queued = JSON.parse(await env.KV.get(queueKey) || '[]');
        if (queued.length > 0) {
          await env.KV.delete(queueKey);

          // 각 메시지를 순서대로 처리 (flow state 진행: 국가→목적→고민 등)
          let lastResult = null;
          const batchResults = [];
          for (const q of queued) {
            const qResult = await generateReply(q.text, senderId, env, q.username);
            batchResults.push({ ...q, result: qResult });
            lastResult = qResult;
          }

          // 마지막 답변만 실제 전송 (중복 답장 방지)
          if (lastResult) {
            const batchReply = lastResult.reply;
            const batchDelay = dShort === 0 ? 0 : Math.min(dLong, Math.max(dShort, batchReply.length * (dMed/100)));
            if (batchDelay > 0) await new Promise(r => setTimeout(r, batchDelay));
            await sendMessage(senderId, batchReply, env, lastResult.quickReplies);
            if (lastResult.followUp) {
              await sendMessage(senderId, lastResult.followUp.text, env, lastResult.followUp.quickReplies);
            }
          }

          // 모든 큐 메시지 로그 기록 (실제 답변 내용 포함)
          if (!isTestUser) {
            for (const br of batchResults) {
              await logMessage(env, {
                senderId,
                username: br.username || '',
                name: br.name || '',
                country: br.result.metadata?.country || metadata.country || '',
                tag: br.result.metadata?.tag || '',
                received: br.text,
                replied: br.result.reply,
                timestamp: br.timestamp,
              });
            }
          }
        }

        // 락 해제
        await env.KV.delete(lockKey);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response('OK', { status: 200 }); // Meta에는 항상 200
  }
}

/** 댓글 자동 답글 */
async function handleComment(comment, env) {
  try {
    // 자기 댓글에는 답글 안 달기
    if (!comment.id || !comment.text) return;

    const config = await getConfig(env);
    if (!config.commentReplyEnabled) return;

    const text = comment.text.toLowerCase();
    const commentId = comment.id;

    // 키워드 매칭으로 답글 결정
    const rules = config.commentRules || [];
    let replyText = '';

    for (const rule of rules) {
      const triggers = (rule.triggers || []).map(t => t.toLowerCase());
      if (triggers.some(t => text.includes(t))) {
        replyText = rule.reply;
        break;
      }
    }

    // 키워드 매칭 안 되면 기본 답글
    if (!replyText) {
      replyText = config.commentDefaultReply || "Thanks for your comment! 😊 Feel free to DM me for a personalized consultation!";
    }

    // Instagram 댓글 답글 API
    const res = await fetch(
      `https://graph.instagram.com/v21.0/${commentId}/replies`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.META_PAGE_TOKEN}`,
        },
        body: JSON.stringify({ message: replyText }),
      }
    );

    if (!res.ok) {
      console.error('Comment reply failed:', await res.text());
    }
  } catch (e) {
    console.error('Comment handler error:', e);
  }
}

/** 유저 프로필 조회 (팔로우 여부 포함) */
async function getUserProfile(userId, env) {
  try {
    const res = await fetch(
      `https://graph.instagram.com/v21.0/${userId}?fields=username,name,is_user_follow_business`,
      { headers: { 'Authorization': `Bearer ${env.META_PAGE_TOKEN}` } }
    );
    if (res.ok) {
      const data = await res.json();
      data.is_follower = data.is_user_follow_business || false;
      return data;
    }
  } catch (e) { console.error('Profile fetch error:', e); }
  return { is_follower: false };
}

/** Instagram Send API */
async function sendMessage(recipientId, text, env, quickReplies) {
  const url = `https://graph.instagram.com/v21.0/me/messages`;
  const message = { text };
  if (quickReplies && quickReplies.length > 0) {
    message.quick_replies = quickReplies.slice(0, 13).map(qr => ({
      content_type: 'text',
      title: qr,
      payload: qr,
    }));
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.META_PAGE_TOKEN}`,
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Send failed (attempt 1):', err);
    // 1회 재시도
    await new Promise(r => setTimeout(r, 1000));
    const retry = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.META_PAGE_TOKEN}` },
      body: JSON.stringify({ recipient: { id: recipientId }, message }),
    });
    if (!retry.ok) console.error('Send failed (attempt 2):', await retry.text());
  }
}
