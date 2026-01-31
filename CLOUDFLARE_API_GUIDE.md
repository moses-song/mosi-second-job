# Cloudflare API 토큰 생성 가이드 (무료)

## 🎯 API 토큰이 필요한 이유
- GitHub Actions 자동 배포
- Workers API 배포
- Pages 자동 관리

## 🆓 무료 플랜 한도
- **Pages**: 무제한 정적 사이트 호스팅
- **Workers**: 월 100,000 요청까지 무료
- **API 호출**: 월 1,000,000번까지 무료

## 🔑 API 토큰 생성 단계

### 1. Cloudflare 계정 로그인
- https://dash.cloudflare.com 접속
- 이메일/비밀번호로 로그인

### 2. API 토큰 페이지 접속
1. 우측 상단 프로필 클릭
2. "My Profile" 선택
3. "API Tokens" 탭 클릭
4. "Create Token" 버튼 클릭

### 3. 토큰 템플릿 선택
- "Custom token" 선택
- 또는 "Cloudflare Pages:Edit" 템플릿 사용 (권장)

### 4. 토큰 권한 설정

**방법 1: Custom Token**
```
Token name: mosi-second-job-deploy

Permissions:
- Cloudflare Pages:Edit
- Account:Cloudflare Pages:Edit
- Zone:Zone:Read (선택사항)

Zone Resources:
- Include All zones
Account Resources:
- Include All accounts
```

**방법 2: 미리 만들어진 템플릿**
- "Cloudflare Pages:Edit" 선택
- "Continue to summary" 클릭

### 5. 토큰 생성 및 복사
1. "Create Token" 클릭
2. **중요**: 생성된 토큰을 즉시 복사 (다시 볼 수 없음)
3. 안전한 곳에 저장

## 📋 필요한 토큰 정보
- **Account ID**: 대시보드 우측에서 복사 가능
- **API Token**: 방금 생성한 토큰

## 🔄 GitHub에 토큰 등록

### 1. GitHub Secrets 설정
1. https://github.com/moses-song/mosi-second-job/settings/secrets/actions 접속
2. "New repository secret" 클릭
3. 추가할 Secrets:
   ```
   CLOUDFLARE_API_TOKEN: [복사한 토큰]
   CLOUDFLARE_ACCOUNT_ID: [계정 ID]
   ```

### 2. 계정 ID 찾는 방법
- Cloudflare 대시보드 우측 하단에서 확인
- 또는 URL에서 확인: `dash.cloudflare.com/[계정ID]`

## 🚀 자동 배포 활성화
토큰 등록 후 GitHub Actions가 자동으로 실행됩니다.

## ⚡ 즉시 수동 배포 (대안)

API 토큰 없이도 수동 배포 가능:

### 1. Pages 직접 업로드
```
1. https://dash.cloudflare.com/pages 접속
2. "Create a project" → "Upload assets"
3. digital-health-cartoon/frontend/dist/ 폴더 드래그
4. 프로젝트 이름: mosi-second-job
5. "Deploy site" 클릭
```

### 2. Workers 직접 배포
```
1. https://dash.cloudflare.com/workers 접속
2. "Create application" → "Hello World"
3. 코드 교체:
   - cloudflare-worker/src/index.js 내용 붙여넣기
4. 배포 후 환경변수 설정:
   - Settings → Variables
   - GEMINI_API_KEY=AIzaSyBPFlxm8zvR7aHqS-1Tfuh5Ps24MRMs8Q8
   - YOUTUBE_API_KEY=AIzaSyDAMWthh8vcjvjuBS2lZHwzp_NCR5xrKUk
```

## 🔒 보안 주의사항
- API 토큰을 GitHub 코드에 직접 넣지 마세요
- Secrets에만 등록하세요
- 토큰 유출 시 즉시 재발급하세요

## 💰 비용 확인
- **무료**: Pages 호스팅, Workers 10만 요청
- **유료**: 초과 시 $0.50/100만 요청
- 대부분의 개인 프로젝트는 무료 플랜으로 충분

---

**🎯 최종 목표**: https://mosi-second-job.pages.dev 정상 운영