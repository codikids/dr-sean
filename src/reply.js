/**
 * 답변 생성 로직
 * A) 첫 메시지 → 인사 + 안내
 * B) 키워드 매칭 → 정해진 답변
 * C) 그 외 → Claude AI 답변
 */

import { getConfig, getConversation, saveConversation, getPatientData, savePatientData } from './storage.js';

const DEFAULT_COUNTRIES = ['United States', 'Singapore', 'Australia', 'Canada', 'Others'];
const DEFAULT_CONCERNS = ['Botox', 'Filler', 'Lifting', 'Anti-aging', 'Acne', 'Skincare', 'Others'];
const DEFAULT_PURPOSES = ['Skin Consultation', 'Booking Inquiry', 'Business'];
const PURPOSE_MAP = {'skin consultation':'skin','booking inquiry':'booking','booking':'booking','business':'business','1':'skin','2':'booking','3':'business'};

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
export async function generateReply(text, senderId, env, username) {
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
    const CONCERN_OPTIONS = config.concernOptions || DEFAULT_CONCERNS;
    const countryReply = `Got it, ${flag} ${typedCountry}! Great to connect with you.`;
    const purposeAsk = "What brings you here today? Tap below!";
    await saveConversation(env, senderId, [
      ...conversation,
      { role: 'user', text },
      { role: 'assistant', text: countryReply },
      { role: 'assistant', text: purposeAsk },
    ]);
    return { reply: countryReply, metadata, followUp: { text: purposeAsk, quickReplies: config.purposeOptions || DEFAULT_PURPOSES } };
  }

  if (!hasCountry) {
    const normalized = text.toLowerCase().trim();
    // Quick Reply 정확 매칭 또는 텍스트 입력 유연 매칭
    let matched = COUNTRY_MAP[normalized];
    if (!matched) {
      // 유연 매칭 — 텍스트에 국가명이 포함되어 있으면 인식
      const FUZZY_MAP = {
        'usa':'United States','america':'United States','us':'United States','united states':'United States',
        'singapore':'Singapore','australia':'Australia','canada':'Canada',
        'china':'China','japan':'Japan','korea':'Korea','thailand':'Thailand','vietnam':'Vietnam',
        'taiwan':'Taiwan','hong kong':'Hong Kong','indonesia':'Indonesia','malaysia':'Malaysia',
        'philippines':'Philippines','myanmar':'Myanmar','india':'India','uk':'UK','united kingdom':'UK',
        'russia':'Russia','germany':'Germany','france':'France','brazil':'Brazil','mexico':'Mexico',
        'netherlands':'Netherlands','italy':'Italy','spain':'Spain','switzerland':'Switzerland',
        'new zealand':'New Zealand','turkey':'Turkey','saudi':'Saudi Arabia','uae':'UAE','dubai':'UAE',
        'egypt':'Egypt','nigeria':'Nigeria','colombia':'Colombia','argentina':'Argentina',
        'pakistan':'Pakistan','bangladesh':'Bangladesh','nepal':'Nepal','cambodia':'Cambodia',
        'laos':'Laos','sri lanka':'Sri Lanka','israel':'Israel','sweden':'Sweden','norway':'Norway',
      };
      for (const [key, val] of Object.entries(FUZZY_MAP)) {
        if (normalized.includes(key)) { matched = val; break; }
      }
    }
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
      await env.KV.put(`country:${senderId}`, metadata.country, { expirationTtl: 60 * 60 * 24 * 90 });
      const CONCERN_OPTIONS = config.concernOptions || DEFAULT_CONCERNS;
      const countryReply = `Got it, ${flag} ${matched}! Great to connect with you.`;
      const purposeAsk = "What brings you here today? Tap below!";
      await saveConversation(env, senderId, [
        ...conversation,
        { role: 'user', text },
        { role: 'assistant', text: countryReply },
        { role: 'assistant', text: purposeAsk },
      ]);
      return { reply: countryReply, metadata, followUp: { text: purposeAsk, quickReplies: config.purposeOptions || DEFAULT_PURPOSES } };
    }
    // 매칭 안 됨 — 몇 번째 시도인지 확인
    const countryRetries = conversation.filter(m => m.role === 'assistant' && (m.text || '').includes('where you from')).length;

    if (countryRetries >= 2) {
      // 3번 이상 실패 → 자동으로 텍스트를 국가로 저장하고 진행
      const typed = text.trim() || 'Unknown';
      const flag = getFlag(typed);
      metadata.country = `${flag} ${typed}`;
      metadata.tag = 'stuck';
      await env.KV.put(`country:${senderId}`, metadata.country, { expirationTtl: 60 * 60 * 24 * 90 });
      const CONCERN_OPTIONS = config.concernOptions || DEFAULT_CONCERNS;
      const rescueMsg = `Got it! Let's get started 😊`;
      const purposeAsk = "What brings you here today? Tap below!";
      await saveConversation(env, senderId, [
        ...conversation,
        { role: 'user', text },
        { role: 'assistant', text: rescueMsg },
        { role: 'assistant', text: purposeAsk },
      ]);
      return { reply: rescueMsg, metadata, followUp: { text: purposeAsk, quickReplies: config.purposeOptions || DEFAULT_PURPOSES } };
    }

    // 1-2번째 시도 → 다시 안내 (stuck 태그 부여)
    metadata.tag = 'stuck';
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

  // ── A-3) Purpose 선택 (Business / Booking / Skin Consultation) ──
  const hasPurpose = await env.KV.get(`purpose:${senderId}`);
  if (hasCountry && !hasPurpose) {
    const normalized = text.toLowerCase().trim();
    const purposeMatch = PURPOSE_MAP[normalized];
    if (!purposeMatch) {
      // 유연 매칭
      let matched = null;
      for (const [k, v] of Object.entries(PURPOSE_MAP)) {
        if (normalized.includes(k)) { matched = v; break; }
      }
      if (!matched) {
        const retryMsg = "How can I help you? Tap below!";
        await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: retryMsg }]);
        return { reply: retryMsg, metadata, quickReplies: config.purposeOptions || DEFAULT_PURPOSES };
      }
      // matched found via fuzzy
      await env.KV.put(`purpose:${senderId}`, matched, { expirationTtl: 60 * 60 * 24 * 90 });
      if (matched === 'business') {
        const bizReply = "Thanks for reaching out! For business inquiries, please hold on — I'll get back to you personally soon 🙏";
        metadata.tag = 'business';
        // 봇 자동 Pause — 이후 AI 답변 차단, 직접 응대
        if(username){const pd=await getPatientData(env);if(!pd[username])pd[username]={};pd[username].paused=true;await savePatientData(env,pd);}
        await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: bizReply }]);
        return { reply: bizReply, metadata };
      }
      if (matched === 'booking') {
        const bookReply = config.booking
          ? `For booking inquiries — ${config.booking}\n\nStarting May 25th, all appointments go through AB Clinic's reservation system. I'll share the details once it's live!\n\nIf you have any skin-related questions, feel free to ask anytime!`
          : "For booking inquiries, I'll be at AB Clinic starting May 25th! I'll share the reservation details soon.\n\nIf you have any skin-related questions, feel free to ask anytime!";
        metadata.tag = 'booking';
        await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: bookReply }]);
        return { reply: bookReply, metadata };
      }
      // skin consultation → concern 선택으로
      const CONCERN_OPTIONS = config.concernOptions || DEFAULT_CONCERNS;
      const skinReply = "Great! What specific skin concern can I help you with?";
      await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: skinReply }]);
      return { reply: skinReply, metadata, followUp: { text: '', quickReplies: CONCERN_OPTIONS } };
    }
    // 정확 매칭
    await env.KV.put(`purpose:${senderId}`, purposeMatch, { expirationTtl: 60 * 60 * 24 * 90 });
    if (purposeMatch === 'business') {
      const bizReply = "Thanks for reaching out! For business inquiries, please hold on — I'll get back to you personally soon 🙏";
      metadata.tag = 'business';
      await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: bizReply }]);
      return { reply: bizReply, metadata };
    }
    if (purposeMatch === 'booking') {
      const bookReply = config.booking
        ? `For booking inquiries — ${config.booking}\n\nStarting May 25th, all appointments go through AB Clinic's reservation system. I'll share the details once it's live!`
        : "For booking inquiries, I'll be at AB Clinic starting May 25th! I'll share the reservation details soon. In the meantime, feel free to ask me anything about treatments!";
      metadata.tag = 'booking';
      await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: bookReply }]);
      return { reply: bookReply, metadata };
    }
    // skin → concern 선택
    const CONCERN_OPTIONS = config.concernOptions || DEFAULT_CONCERNS;
    const skinReply = "Great! What specific skin concern can I help you with? Tap below!";
    await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: skinReply }]);
    return { reply: skinReply, metadata, quickReplies: CONCERN_OPTIONS };
  }

  // ── A-4) Concern 선택 ──
  const hasConcern = await env.KV.get(`concern:${senderId}`);
  const CONCERN_OPTIONS = config.concernOptions || DEFAULT_CONCERNS;

  // "Others" 직접 입력 대기 중
  const awaitingConcern = await env.KV.get(`awaiting_concern:${senderId}`);
  if (awaitingConcern) {
    const typed = text.trim();
    if (typed.length < 2) {
      const retryMsg = "Could you describe your skin concern? For example: wrinkles, dark spots, acne, etc.";
      await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: retryMsg }]);
      return { reply: retryMsg, metadata };
    }
    metadata.tag = typed.toLowerCase().replace(/\s+/g, '-');
    await env.KV.put(`concern:${senderId}`, typed, { expirationTtl: 60 * 60 * 24 * 90 });
    await env.KV.delete(`awaiting_concern:${senderId}`);
    const concernReply = `${typed} — got it! Let me help you with that 😊`;
    await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: concernReply }]);
    return { reply: concernReply, metadata };
  }

  if (hasCountry && (hasPurpose === 'skin' || hasPurpose === 'booking') && !hasConcern) {
    const normalized = text.toLowerCase().trim();
    // Quick Reply 매칭
    const CONCERN_MAP = {};
    CONCERN_OPTIONS.forEach(c => { CONCERN_MAP[c.toLowerCase()] = c; });
    CONCERN_OPTIONS.forEach((c, i) => { CONCERN_MAP[String(i + 1)] = c; });

    let matched = CONCERN_MAP[normalized];
    if (!matched) {
      // 유연 매칭
      for (const opt of CONCERN_OPTIONS) {
        if (normalized.includes(opt.toLowerCase())) { matched = opt; break; }
      }
    }

    if (matched === 'Others') {
      const askConcern = "Tell me more about your skin concern! What would you like help with?";
      await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: askConcern }]);
      await env.KV.put(`awaiting_concern:${senderId}`, 'true', { expirationTtl: 60 * 60 });
      return { reply: askConcern, metadata };
    }
    if (matched) {
      metadata.tag = matched.toLowerCase().replace(/\s+/g, '-');
      await env.KV.put(`concern:${senderId}`, matched, { expirationTtl: 60 * 60 * 24 * 90 });
      const concernReply = `${matched} — great choice! Let me help you with that 😊`;
      await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: concernReply }]);
      return { reply: concernReply, metadata };
    }

    // 매칭 안 됨 — concern으로 직접 저장
    const concernRetries = conversation.filter(m => m.role === 'assistant' && (m.text || '').includes('brings you here')).length;
    if (concernRetries >= 2) {
      metadata.tag = normalized.replace(/\s+/g, '-') || 'consultation';
      await env.KV.put(`concern:${senderId}`, text.trim(), { expirationTtl: 60 * 60 * 24 * 90 });
      const rescueMsg = "Got it! Let me help you out 😊";
      await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: rescueMsg }]);
      return { reply: rescueMsg, metadata };
    }
    const retryMsg = "What skin concern can I help you with? Tap below!";
    await saveConversation(env, senderId, [...conversation, { role: 'user', text }, { role: 'assistant', text: retryMsg }]);
    return { reply: retryMsg, metadata, quickReplies: CONCERN_OPTIONS };
  }

  // 저장된 concern 불러오기
  if (hasConcern && !metadata.tag) metadata.tag = hasConcern.toLowerCase().replace(/\s+/g, '-');

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
    if (metadata.tag === 'none' || metadata.tag === 'general') metadata.tag = '';
    if (metaMatch[2].trim().toLowerCase() !== 'unknown') {
      metadata.country = metadata.country || metaMatch[2].trim();
    }
    cleanReply = rawReply.replace(/^\[TAG:.*?\]\s*\n*/i, '').trim();
  } else {
    // TAG 추출 실패 시 — 키워드 기반 자동 분류
    const t = text.toLowerCase();
    const tagMap = [
      // 피부 고민
      ['acne','acne'],['pimple','acne'],['breakout','acne'],['zit','acne'],
      ['scar','scar'],['scarring','scar'],
      ['dark spot','pigmentation'],['pigment','pigmentation'],['melasma','melasma'],['hyperpigment','pigmentation'],['sun spot','pigmentation'],['freckle','pigmentation'],
      ['whiten','whitening'],['brighten','whitening'],['glow','whitening'],['lighten','whitening'],['tone','whitening'],['fair','whitening'],
      ['wrinkle','anti-aging'],['aging','anti-aging'],['anti-aging','anti-aging'],['fine line','anti-aging'],['sagging','anti-aging'],['saggy','anti-aging'],['lifting','lifting'],['lift','lifting'],['tighten','lifting'],['firm','lifting'],
      ['oily','oily-skin'],['dry skin','dry-skin'],['sensitive','sensitive-skin'],['eczema','eczema'],['dermatitis','eczema'],['psoriasis','psoriasis'],
      ['pore','pore'],['blackhead','pore'],['whitehead','pore'],
      ['redness','redness'],['rosacea','redness'],['flush','redness'],
      ['dark circle','dark-circles'],['under eye','dark-circles'],['eye bag','eye-bag'],['puffy eye','eye-bag'],
      ['routine','skincare'],['moistur','skincare'],['cleanser','skincare'],['serum','skincare'],['sunscreen','skincare'],['spf','skincare'],['retinol','skincare'],['vitamin c','skincare'],
      // 시술/치료
      ['botox','botox'],['filler','filler'],['hyaluronic','filler'],
      ['laser','laser'],['ipl','laser'],['peel','peel'],['chemical peel','peel'],
      ['facelift','facelift'],['face lift','facelift'],['thread','thread-lift'],['thread lift','thread-lift'],
      ['rhinoplasty','rhinoplasty'],['nose','rhinoplasty'],['nose job','rhinoplasty'],
      ['lip','lip'],['jawline','jawline'],['jaw','jawline'],['v-line','jawline'],['vline','jawline'],
      ['cheek','cheek'],['forehead','forehead'],['eyelid','eyelid'],['double eyelid','eyelid'],['blepharoplasty','eyelid'],
      ['chin','chin'],['neck','neck'],['double chin','chin'],
      ['hair','hair'],['transplant','transplant'],['hair loss','hair'],['bald','hair'],
      ['liposuction','liposuction'],['lipo','liposuction'],['fat','liposuction'],
      ['tummy','body'],['body','body'],['breast','breast'],['augment','augmentation'],
      // 일반 상담
      ['consultation','consultation'],['appointment','consultation'],['procedure','consultation'],
      ['surgery','consultation'],['cost','consultation'],['price','consultation'],['how much','consultation'],
      ['treatment','consultation'],['skin','consultation'],
    ];
    for (const [kw, tag] of tagMap) {
      if (t.includes(kw)) { metadata.tag = tag; break; }
    }
    if (!metadata.tag) metadata.tag = '';
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
    // API 키: config(사용자 설정) 우선, 없으면 env(개발자 키)
    const apiKey = config.claudeApiKey || env.CLAUDE_API_KEY;
    const model = config.claudeModel || 'claude-haiku-4-5-20251001';
    if (!apiKey) return config.fallback || 'AI is not configured. Please add a Claude API key in Settings.';

    // 월간 한도 체크
    const month = new Date().toISOString().slice(0, 7);
    const usage = JSON.parse(await env.KV.get(`ai_usage:${month}`) || '{"requests":0,"inputTokens":0,"outputTokens":0,"cost":0}');
    if (config.claudeMonthlyLimit && usage.cost >= config.claudeMonthlyLimit) {
      return config.fallback || 'Thanks for reaching out! Our AI assistant is currently at capacity. We\'ll get back to you soon!';
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
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

    // 토큰 사용량 추적
    const inTok = data.usage?.input_tokens || 0;
    const outTok = data.usage?.output_tokens || 0;
    // 가격 계산 (per 1M tokens) — Haiku: $0.80/$4, Sonnet: $3/$15, Opus: $15/$75
    const prices = {'claude-haiku-4-5-20251001':[0.80,4],'claude-sonnet-4-6':[3,15],'claude-opus-4-6':[15,75]};
    const [inPrice,outPrice] = prices[model] || [0.80,4];
    const cost = (inTok * inPrice / 1e6) + (outTok * outPrice / 1e6);
    usage.requests++;
    usage.inputTokens += inTok;
    usage.outputTokens += outTok;
    usage.cost = Math.round((usage.cost + cost) * 1e6) / 1e6;
    await env.KV.put(`ai_usage:${month}`, JSON.stringify(usage));

    let reply = data.content[0].text;
    // 마크다운 제거 (인스타 DM은 plain text만 지원)
    reply = reply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#+\s/gm, '').replace(/^- /gm, '• ');
    // AI 관련 텍스트 제거
    reply = reply.replace(/\*?\*?this is an ai[^.]*/gi, '').replace(/as an ai[^.]*/gi, '').replace(/i'?m an ai[^.]*/gi, '').replace(/ai generated[^.]*/gi, '').replace(/disclaimer[^.]*/gi, '').trim();
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

## Consultation Strategy — CRITICAL
1. NEVER sound 100% certain about treatments over DM. Always leave room for "I'd need to see you in person to give the best recommendation."
2. Your real goal is to get them to BOOK an appointment. But NEVER be pushy or salesy about it. It should feel natural, like a friend suggesting they come in.
3. Give helpful advice first — show you know your stuff. Then naturally drop that an in-person consultation would be way better.
4. Pattern: recommend a treatment direction → hedge with "but honestly, it depends on your skin in person" → casually mention booking.
5. Examples of good hedging:
   - "i think [treatment] could work really well for you, but i'd wanna take a proper look first before we commit to anything"
   - "hard to say exactly without seeing it tbh. when you come in i can figure out the best game plan"
   - "this is what i'd lean towards, but everyone's skin is different — let's figure it out together when you visit"
6. NEVER say "you should book" or "schedule a consultation." Instead: "come see me" / "when you visit" / "let's sort it out in person"

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
- Appointment bookings will open after May 25th through AB Clinic's reservation system.
- CRITICAL: Even though bookings aren't open yet, you MUST still provide full skin consultations over DM. Answer their questions about treatments, recommend procedures, explain what they need. Do NOT just say "bookings start May 25th" — that's lazy and unhelpful. Give them real medical advice first, THEN mention the clinic visit as a follow-up.
- If someone asks about treatments, procedures, or skin concerns — ANSWER THEM with specific, helpful advice. The booking info is secondary.

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
4. NEVER reveal you are an AI, bot, or automated system. You ARE Dr. Sean — a real dermatologist. Never say "AI generated", "I'm an AI", "as an AI", or anything similar. If asked, deflect naturally.
5. ${config.customRules || ''}

## IMPORTANT: Response Format
You MUST start EVERY reply with a metadata line in this exact format, then a blank line, then your actual message:
[TAG: category | COUNTRY: country_if_known]

- TAG: a specific English keyword for their skin concern or desired procedure. Be as specific as possible. Examples: acne, scar, pigmentation, whitening, botox, filler, wrinkle, anti-aging, lifting, pore, redness, rhinoplasty, jawline, facelift, eyelid, lip, laser, peel, thread-lift, hair, liposuction, skincare, consultation. Use "none" if the message has absolutely nothing to do with skin, beauty, or medical procedures.
- COUNTRY: the country if you know it from the conversation, otherwise "unknown"
- CRITICAL: If the patient mentions ANY skin concern, treatment, procedure, or beauty topic, you MUST use a specific tag — NEVER use "general" for these. The tag is used for patient funnel tracking.

Example:
[TAG: whitening | COUNTRY: India]

Hey! So for skin brightening, it really depends on...

The metadata line will be stripped before sending — the user will NOT see it. But you MUST always include it.`;
}
