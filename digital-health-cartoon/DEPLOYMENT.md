# Digital Health Cartoon - Cloudflare Deployment

## 배포 단계

### 1. 프론트엔드 (Cloudflare Pages)
```bash
# 이미 빌드 완료: digital-health-cartoon/frontend/dist/
# Cloudflare Pages 대시보드에서 배포
```

### 2. 백엔드 (Cloudflare Workers)
```bash
cd cloudflare-worker
npm install
npm run deploy
```

### 3. 환경 변수 설정
- Cloudflare Workers 대시보드에서 API 키 설정:
  - OPENAI_API_KEY
  - YOUTUBE_API_KEY

### 4. 프론트엔드-백엔드 연결
- 프론트엔드 코드에서 API URL 변경 필요
- Workers URL: https://your-worker-name.your-subdomain.workers.dev

## 현재 상태
✅ 프론트엔드 빌드 완료
✅ Cloudflare Workers 코드 준비
⚠️ API 키 필요
⚠️ 배포 진행 필요