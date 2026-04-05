# Dr.sean 셋업 가이드

## 1. KV Namespace 생성
```bash
cd "c:/Users/wlsdu/OneDrive/바탕 화면/클로드코드/Dr.sean"
npx wrangler kv namespace create KV
```
출력된 id를 `wrangler.toml`의 `id = "TO_BE_CREATED"` 에 붙여넣기

## 2. 시크릿 등록
```bash
npx wrangler secret put META_VERIFY_TOKEN    # 아무 문자열 (내가 정함)
npx wrangler secret put META_APP_SECRET      # Meta 앱 > 설정 > 앱 시크릿
npx wrangler secret put META_PAGE_TOKEN      # Meta 앱 > Instagram > 토큰 생성
npx wrangler secret put CLAUDE_API_KEY       # Anthropic API 키
```

## 3. 배포
```bash
npx wrangler deploy
```

## 4. Meta 앱 설정
1. [developers.facebook.com](https://developers.facebook.com) → 앱 만들기
2. Instagram 제품 추가 → Messaging
3. Webhook URL: `https://dr-sean.<계정>.workers.dev/webhook`
4. Verify Token: 위에서 정한 META_VERIFY_TOKEN
5. Subscription: `messages` 이벤트 구독

## 5. 대시보드 접속
`https://dr-sean.<계정>.workers.dev/` 에서 병원 정보 입력
