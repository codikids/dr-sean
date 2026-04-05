/**
 * 답변 생성 로직
 * A) 첫 메시지 → 인사 + 안내
 * B) 키워드 매칭 → 정해진 답변
 * C) 그 외 → Claude AI 답변
 */

import { getConfig, getConversation, saveConversation } from './storage.js';

const DEFAULT_COUNTRIES = ['United States', 'Singapore', 'Australia', 'Canada', 'Others'];

// COUNTRY_MAP은 generateReply 안에서 config 기반으로 생성

const COUNTRY_FLAGS = {
  'China': '🇨🇳', 'Japan': '🇯🇵', 'Thailand': '🇹🇭', 'Vietnam': '🇻🇳',
  'Korea': '🇰🇷', 'South Korea': '🇰🇷', 'Taiwan': '🇹🇼', 'Hong Kong': '🇭🇰',
  'Indonesia': '🇮🇩', 'Malaysia': '🇲🇾', 'Philippines': '🇵🇭', 'Singapore': '🇸🇬',
  'India': '🇮🇳', 'Australia': '🇦🇺', 'UK': '🇬🇧', 'United Kingdom': '🇬🇧',
  'Canada': '🇨🇦', 'USA': '🇺🇸', 'United States': '🇺🇸', 'America': '🇺🇸',
  'Russia': '🇷🇺', 'Germany': '🇩🇪', 'France': '🇫🇷', 'Italy': '🇮🇹',
  'Spain': '🇪🇸', 'Netherlands': '🇳🇱', 'Brazil': '🇧🇷', 'Mexico': '🇲🇽',
  'Myanmar': '🇲🇲', 'Burma': '🇲🇲', 'Cambodia': '🇰🇭', 'Laos': '🇱🇦',
  'Bangladesh': '🇧🇩', 'Pakistan': '🇵🇰', 'Sri Lanka': '🇱🇰', 'Nepal': '🇳🇵',
  'Mongolia': '🇲🇳', 'Turkey': '🇹🇷', 'Saudi Arabia': '🇸🇦', 'UAE': '🇦🇪',
  'Dubai': '🇦🇪', 'Qatar': '🇶🇦', 'Kuwait': '🇰🇼', 'Iran': '🇮🇷',
  'Egypt': '🇪🇬', 'South Africa': '🇿🇦', 'Nigeria': '🇳🇬', 'Kenya': '🇰🇪',
  'New Zealand': '🇳🇿', 'Sweden': '🇸🇪', 'Norway': '🇳🇴', 'Denmark': '🇩🇰',
  'Finland': '🇫🇮', 'Poland': '🇵🇱', 'Czech': '🇨🇿', 'Austria': '🇦🇹',
  'Switzerland': '🇨🇭', 'Belgium': '🇧🇪', 'Portugal': '🇵🇹', 'Ireland': '🇮🇪',
  'Greece': '🇬🇷', 'Romania': '🇷🇴', 'Hungary': '🇭🇺', 'Ukraine': '🇺🇦',
  'Argentina': '🇦🇷', 'Colombia': '🇨🇴', 'Chile': '🇨🇱', 'Peru': '🇵🇪',
  'Uzbekistan': '🇺🇿', 'Kazakhstan': '🇰🇿', 'Israel': '🇮🇱',
};
function getFlag(country) {
  if (!country) return '';
  for (const [name, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (country.toLowerCase().includes(name.toLowerCase())) return flag;
  }
  return '🌏';
}

/** 메인 답변 생성 — metadata도 함께 반환 */
export async function generateReply(text, senderId, env) {
  const config = await getConfig(env);
  const conversation = await getConversation(env, senderId);
  const isFirst = conversation.length === 0;
  const metadata = { tag: '', country: '' };

  // 국가 목록 — config에서 가져오거나 기본값
  const COUNTRY_OPTIONS = config.countryOptions || DEFAULT_COUNTRIES;
  const COUNTRY_MAP = {};
  COUNTRY_OPTIONS.forEach(c => { COUNTRY_MAP[c.toLowerCase()] = c; });
  COUNTRY_OPTIONS.forEach((c, i) => { COUNTRY_MAP[String(i + 1)] = c; });

  // ── A) 첫 메시지 → 인사 먼저, 그다음 국가 질문 + 버튼 ──
  if (isFirst) {
    const countryAsk = "Quick question — where are you based? This helps me give you more accurate advice for your skin and climate!";
    await saveConversation(env, senderId, [
      { role: 'user', text },
      { role: 'assistant', text: config.greeting },
      { role: 'assistant', text: countryAsk },
    ]);
    return { reply: config.greeting, metadata, followUp: { text: countryAsk, quickReplies: COUNTRY_OPTIONS } };
  }

  // ── A-2) 국가 선택 응답 확인 ──
  const hasCountry = await env.KV.get(`country:${senderId}`);

  // "Others" 직접 입력 대기 중 — 국가명 검증
  const awaitingCountry = await env.KV.get(`awaiting_country:${senderId}`);
  if (awaitingCountry) {
    const typedCountry = text.trim();
    // 유효한 국가인지 검증 (최소 2글자, 숫자 없음, 일반 인사말 아님)
    const invalid = typedCountry.length < 2
      || /\d/.test(typedCountry)
      || /^(hi|hello|hey|yes|no|ok|sure|thanks|please|help)/i.test(typedCountry);
    if (invalid) {
      const retryMsg = "Hmm, that doesn't look like a country name. Could you type your country? For example: Indonesia, Taiwan, Singapore, etc.";
      await saveConversation(env, senderId, [
        ...conversation,
        { role: 'user', text },
        { role: 'assistant', text: retryMsg },
      ]);
      return { reply: retryMsg, metadata };
    }
    const flag = getFlag(typedCountry);
    metadata.country = `${flag} ${typedCountry}`;
    await env.KV.put(`country:${senderId}`, metadata.country, { expirationTtl: 60 * 60 * 24 * 90 });
    await env.KV.delete(`awaiting_country:${senderId}`);
    const countryReply = `Got it, ${flag} ${typedCountry}! Great to connect with you.\n\nSo what's on your mind? Feel free to ask me anything about skin care or treatments!`;
    await saveConversation(env, senderId, [
      ...conversation,
      { role: 'user', text },
      { role: 'assistant', text: countryReply },
    ]);
    return { reply: countryReply, metadata };
  }

  if (!hasCountry) {
    const normalized = text.toLowerCase().trim();
    const matched = COUNTRY_MAP[normalized];
    // "Others" 선택 시 → 직접 입력 요청
    if (matched === 'Others') {
      const askCountry = "Type your country! Knowing where you're from helps me give you more accurate skincare advice based on your climate and skin type.";
      await saveConversation(env, senderId, [
        ...conversation,
        { role: 'user', text },
        { role: 'assistant', text: askCountry },
      ]);
      await env.KV.put(`awaiting_country:${senderId}`, 'true', { expirationTtl: 60 * 60 });
      return { reply: askCountry, metadata };
    }
    if (matched) {
      const flag = getFlag(matched);
      metadata.country = `${flag} ${matched}`;
      const countryReply = `Got it, ${flag} ${matched}! Great to connect with you.\n\nSo what's on your mind? Feel free to ask me anything about skin care or treatments!`;
      await saveConversation(env, senderId, [
        ...conversation,
        { role: 'user', text },
        { role: 'assistant', text: countryReply },
      ]);
      await env.KV.put(`country:${senderId}`, metadata.country, { expirationTtl: 60 * 60 * 24 * 90 });
      return { reply: countryReply, metadata };
    }
    // 매칭 안 됨 → 국가 선택 다시 안내 (Quick Replies)
    const retryMsg = "Where are you from? Tap below!";
    await saveConversation(env, senderId, [
      ...conversation,
      { role: 'user', text },
      { role: 'assistant', text: retryMsg },
    ]);
    return { reply: retryMsg, metadata, quickReplies: COUNTRY_OPTIONS };
  }

  // 저장된 국가 정보 불러오기
  const savedCountry = await env.KV.get(`country:${senderId}`);
  if (savedCountry) metadata.country = savedCountry;

  // ── B) 키워드 매칭 ──
  const keywordReply = matchKeyword(text, config.keywords);
  if (keywordReply) {
    await saveConversation(env, senderId, [
      ...conversation,
      { role: 'user', text },
      { role: 'assistant', text: keywordReply },
    ]);
    return { reply: keywordReply, metadata };
  }

  // ── C) Claude AI 답변 (국가 정보 포함) ──
  const rawReply = await askClaude(text, conversation, config, env, metadata.country);

  // 메타데이터 파싱 [TAG: xxx | COUNTRY: xxx]
  const metaMatch = rawReply.match(/^\[TAG:\s*(\w[\w-]*)\s*\|\s*COUNTRY:\s*([^\]]+)\]/i);
  let cleanReply = rawReply;
  if (metaMatch) {
    metadata.tag = metaMatch[1].toLowerCase();
    if (metaMatch[2].trim().toLowerCase() !== 'unknown') {
      metadata.country = metadata.country || metaMatch[2].trim();
    }
    cleanReply = rawReply.replace(/^\[TAG:.*?\]\s*\n*/i, '').trim();
  } else {
    // TAG 추출 실패 시 — 키워드 기반 자동 분류
    const t = text.toLowerCase();
    const tagMap = [
      ['acne','acne'],['pimple','acne'],['breakout','acne'],['scar','scar'],['dark spot','pigmentation'],
      ['pigment','pigmentation'],['melasma','melasma'],['botox','botox'],['filler','filler'],
      ['wrinkle','wrinkle'],['aging','aging'],['anti-aging','aging'],['oily','oily'],
      ['pore','pore'],['redness','redness'],['rosacea','redness'],['laser','laser'],
      ['routine','routine'],['dark circle','dark-circles'],['under eye','dark-circles'],
    ];
    for (const [kw, tag] of tagMap) {
      if (t.includes(kw)) { metadata.tag = tag; break; }
    }
    if (!metadata.tag) metadata.tag = 'general';
    // 메타데이터 라인 제거 (부분 매칭)
    cleanReply = rawReply.replace(/^\[.*?\]\s*\n*/i, '').trim() || rawReply;
  }

  await saveConversation(env, senderId, [
    ...conversation.slice(-18),
    { role: 'user', text },
    { role: 'assistant', text: cleanReply },
  ]);

  // 병원 내방 안내 — 별도 메시지로 전송
  const visitMessages = [
    "For a more detailed consultation, I'd love to see you in person at AB Clinic! We can go over everything together and find the best plan for you.",
    "If you'd like a proper assessment, come visit me at AB Clinic! I can explain everything in much more detail face to face.",
    "Want to dive deeper into this? Swing by AB Clinic and we'll get you sorted with a personalized plan!",
    "For the full picture, nothing beats an in-person consultation! Come see me at AB Clinic and we'll figure out the perfect approach for you.",
    "I can go into way more detail when I see you in person! Let's set something up at AB Clinic.",
  ];
  const visitMsg = visitMessages[Math.floor(Math.random() * visitMessages.length)];

  return { reply: cleanReply, metadata, followUp: { text: visitMsg } };
}

/** 키워드 매칭 */
function matchKeyword(text, keywords) {
  const normalized = text.toLowerCase().trim();
  for (const kw of keywords) {
    for (const trigger of kw.triggers) {
      if (normalized.includes(trigger.toLowerCase())) {
        return kw.reply;
      }
    }
  }
  return null;
}

/** Claude API 호출 */
async function askClaude(text, conversation, config, env, country) {
  const systemPrompt = buildSystemPrompt(config, country);

  // 대화 히스토리를 Claude 형식으로 변환
  const messages = conversation.map(m => ({
    role: m.role,
    content: m.text,
  }));
  messages.push({ role: 'user', content: text });

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      console.error('Claude API error:', await res.text());
      return config.fallback || 'Sorry, please try again shortly. Thank you!';
    }

    const data = await res.json();
    let reply = data.content[0].text;
    // 마크다운 제거 (인스타 DM은 plain text만 지원)
    reply = reply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#+\s/gm, '').replace(/^- /gm, '• ');
    // 인스타 DM 글자 제한 (1000자) — 병원 안내 부분 분리
    if (reply.length > 800) {
      reply = reply.slice(0, 800).replace(/\s+\S*$/, '');
    }
    return reply;
  } catch (err) {
    console.error('Claude error:', err);
    return config.fallback || 'Sorry, please try again shortly. Thank you!';
  }
}

/** 기본 프롬프트 */
const DEFAULT_PROMPT = `You're a real dermatologist — not an AI, not a chatbot, not a customer service rep. You're a 30-something guy who genuinely loves skincare and helping people feel good about their skin. You happen to be really good at what you do, and you're texting back between patients.

## How You Talk
- You text like a normal person. Short. Casual. Real.
- Use "haha" or "lol" occasionally if it fits. Not forced.
- Don't start every message with "Great question!" or "That's a good point!" — real people don't talk like that.
- Sometimes start with "hmm" or "oh" or "yeah so" — like you're actually thinking.
- Mix up sentence length. Some short. Some a bit longer when explaining something.
- Never use phrases like "I understand your concern" or "Thank you for reaching out" — that's corporate robot talk.
- Contractions ALWAYS. "I'd", "you'll", "that's", "it's", "don't", "won't".
- Max 2-3 sentences. This is a DM, not an email. If they want more, they'll ask.
- ONE emoji max per message. Sometimes zero. Don't force it.

## Examples of YOUR voice
GOOD: "oh yeah that's super common actually. a gentle retinol at night would help a ton — just start slow, like 2x a week"
GOOD: "hmm hard to say without seeing it tbh. could be a few things. when you come in I can take a proper look"
GOOD: "honestly? sunscreen is like 80% of the battle lol. everything else is bonus"
BAD: "Great question! I would recommend incorporating a retinol-based product into your nighttime routine."
BAD: "Thank you for reaching out! I understand your concern about acne scarring."
BAD: "I appreciate you sharing that with me. Here are some suggestions..."

## Medical Rules — NON-NEGOTIABLE
1. You CAN give general skincare advice, explain treatments, suggest OTC products. But keep it casual — "a lot of people find that..." not "studies have shown that..."
2. Be accurate. Don't make stuff up. If unsure: "honestly I'd wanna see that in person before saying anything definitive"
3. Never prescribe meds over DM. Ever.
4. Never diagnose from descriptions alone. "it sounds like it could be..." is fine. "you have..." is not.
5. Serious stuff (weird moles, infections, severe reactions) — drop the casual tone slightly and tell them to see someone ASAP.
6. Product recs: stick to stuff that actually works. Sunscreen, retinoids, niacinamide, ceramides, gentle cleansers.
7. Booking: AB Clinic reservation system after May 25th.`;

/** AI 시스템 프롬프트 생성 — config.aiPrompt가 있으면 그걸 사용 */
function buildSystemPrompt(config, country) {
  const basePrompt = config.aiPrompt || DEFAULT_PROMPT;

  const countrySection = country ? `
## Patient's Country/Region: ${country}
IMPORTANT: Tailor your advice to this person's region. Consider:
- Climate & environment (humidity, UV intensity, pollution levels, temperature)
- Skin characteristics common in their ethnic background (melanin levels, sensitivity, common concerns)
- Products and brands locally available in their country
- Common skin concerns for people from this region
- Cultural skincare practices and preferences
- If they mention traveling to Korea for treatment, factor in post-treatment care when they return to their home climate
Always naturally weave in region-specific insight.` : '';

  return `${basePrompt}
${countrySection}

## Your Current Situation
- Starting May 25th, you'll be working at AB Clinic (Seoul, Seocho-gu, BLOCK77 3F).
- All appointment bookings must go through AB Clinic's reservation system after May 25th.
- Before May 25th, in-person appointments are difficult to arrange.
- You CAN provide skin-related consultations and advice over DM right now.

## Clinic Info (after May 25th)
- Clinic Name: ${config.clinicName}
- Address: ${config.address}
- Hours: ${config.hours}
- Booking: ${config.booking}
- Phone: ${config.phone}

## Treatments
${config.treatments || '(No treatment info registered yet)'}

## Hard Rules
1. ALWAYS respond in English, even if the user writes in another language.
2. Be honest about what you can and can't assess over DM. Honesty builds trust.
3. Do NOT include clinic visit invitations in your reply. A separate follow-up message will handle that automatically. Focus ONLY on the skin advice itself. Keep your reply under 600 characters.
4. ${config.customRules || ''}

## IMPORTANT: Response Format
You MUST start EVERY reply with a metadata line in this exact format, then a blank line, then your actual message:
[TAG: category | COUNTRY: country_if_known]

- TAG: a single English word summarizing what they're asking about (e.g. acne, scar, pigmentation, botox, filler, oily, wrinkle, pore, redness, routine, laser, general)
- COUNTRY: the country if you know it from the conversation, otherwise "unknown"

Example:
[TAG: acne | COUNTRY: Japan]

Hey! So for acne scarring, it really depends on...

The metadata line will be stripped before sending — the user will NOT see it. But you MUST always include it.`;
}
