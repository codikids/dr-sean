/**
 * Cloudflare KV 기반 저장소
 * - config: 병원 설정
 * - conversations: 대화 히스토리 (senderId별)
 * - logs: DM 로그
 */

/** 기본 설정 */
const DEFAULT_CONFIG = {
  clinicName: 'AB Clinic',
  address: '3F, BLOCK77, 17 Seocho-daero 77-gil, Seocho-gu, Seoul, South Korea',
  hours: 'Mon/Thu/Fri 10:00–21:00, Tue/Wed 10:00–19:00, Sat 10:00–17:00',
  phone: '',
  booking: '100% appointment-only (DM or call to book)',
  treatments: '',
  customRules: '',
  greeting: "Hey! Thanks so much for reaching out 😊\n\nJust wanted to let you know — starting May 25th, I'll be working at AB Clinic! All appointment bookings will need to go through their reservation system once I'm there.\n\nUntil then, bookings are a little tricky, but if you have any skin-related questions, feel free to ask! I'm happy to help with a quick consultation right here 💬",
  fallback: "Hey, so sorry about that! We're having a little trouble right now — mind trying again in a bit? 🙏",
  keywords: [
    {
      triggers: ['location', 'address', 'where', 'directions', 'find you', 'located'],
      reply: "📍 Here's how to find us!\n\n(Please set the address in the dashboard)",
    },
    {
      triggers: ['book', 'appointment', 'reserve', 'schedule', 'visit'],
      reply: "📅 We'd love to see you! Here's how to book:\n\n(Please set the booking method in the dashboard)",
    },
    {
      triggers: ['price', 'cost', 'how much', 'pricing', 'fee', 'rate'],
      reply: "Pricing really depends on what you're looking for — everyone's skin is different! 😊 I'd love to go over everything in detail when you come in for a consultation. That way I can give you the most accurate estimate!",
    },
  ],
};

/** 설정 불러오기 */
export async function getConfig(env) {
  const raw = await env.KV.get('config', 'json');
  return raw ? { ...DEFAULT_CONFIG, ...raw } : DEFAULT_CONFIG;
}

/** 설정 저장 */
export async function saveConfig(env, config) {
  await env.KV.put('config', JSON.stringify(config));
}

/** 대화 히스토리 불러오기 */
export async function getConversation(env, senderId) {
  const raw = await env.KV.get(`conv:${senderId}`, 'json');
  return raw || [];
}

/** 대화 히스토리 저장 (최근 20개 메시지만 유지) */
export async function saveConversation(env, senderId, messages) {
  const trimmed = messages.slice(-20);
  await env.KV.put(`conv:${senderId}`, JSON.stringify(trimmed), {
    expirationTtl: 60 * 60 * 24 * 7, // 7일 후 자동 삭제
  });
}

/** DM 로그 저장 — 전체 배열 업데이트 */
export async function logMessage(env, log) {
  const entry = {
    senderId: log.senderId || '',
    username: log.username || '',
    name: log.name || '',
    country: log.country || '',
    tag: log.tag || '',
    received: (log.received || '').substring(0, 300),
    replied: (log.replied || '').substring(0, 500),
    timestamp: log.timestamp || Date.now(),
    createdAt: new Date().toISOString(),
  };

  try {
    let allLogs = await env.KV.get('all_logs', 'json') || [];

    // 중복 방지 (같은 senderId + 같은 timestamp)
    const isDup = allLogs.some(l => l.senderId === entry.senderId && l.timestamp === entry.timestamp);
    if (isDup) return;

    allLogs.unshift(entry);
    // 최대 400개 유지 (KV 512KB 한도 안전)
    if (allLogs.length > 400) allLogs = allLogs.slice(0, 400);
    await env.KV.put('all_logs', JSON.stringify(allLogs));
  } catch(e) {
    console.error('logMessage failed:', e);
  }
}

/** DM 로그 전체 가져오기 — 단일 KV read (빠름) */
export async function getRecentLogs(env) {
  try {
    const logs = await env.KV.get('all_logs', 'json');
    return logs || [];
  } catch(e) { return []; }
}
