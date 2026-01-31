# Error 522 해결 가이드

## 문제 원인
Error 522는 Cloudflare가 원본 서버와 연결할 수 없을 때 발생합니다. 현재 GitHub Actions 배포가 실패하여 웹사이트가 없는 상태입니다.

## 즉시 해결 방법

### 1. Cloudflare Pages 직접 배포 (권장)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/pages) 접속
2. "Create a project" 클릭
3. "Connect to Git" 선택
4. GitHub 리포지토리: `moses-song/mosi-second-job`
5. **빌드 설정:**
   ```
   빌드 명령어: cd digital-health-cartoon/frontend && npm run build
   빌드 출력 디렉토리: digital-health-cartoon/frontend/dist
   루트 디렉토리: /
   ```

### 2. 로컬 파일 직접 업로드
```bash
# 1. GitHub에서 ZIP 다운로드
curl -L https://github.com/moses-song/mosi-second-job/archive/refs/heads/main.zip -o repo.zip
unzip repo.zip

# 2. 빌드 파일 압축
cd mosi-second-job-main/digital-health-cartoon/frontend
zip -r frontend.zip dist/

# 3. Cloudflare Pages 대시보드에서 업로드
```

### 3. Workers API 먼저 배포
```bash
# Cloudflare Workers 대시보드에서
# 1. wrangler.toml 내용 복사하여 배포
# 2. 환경변수 설정:
#    GEMINI_API_KEY=AIzaSyBPFlxm8zvR7aHqS-1Tfuh5Ps24MRMs8Q8
#    YOUTUBE_API_KEY=AIzaSyDAMWthh8vcjvjuBS2lZHwzp_NCR5xrKUk
```

## 현재 상태
- ✅ 코드 준비 완료
- ✅ 빌드 파일 생성 완료
- ❌ GitHub Actions 실패 (Permissions 이슈)
- ⏳ 수동 배포 필요

## 빠른 테스트 방법
로컬에서 서버 실행:
```bash
# 터미널 1 - 프론트엔드
cd digital-health-cartoon/frontend
npm run dev

# 터미널 2 - 백엔드  
cd digital-health-cartoon/backend
npm run dev
```

접속: http://localhost:5173

## 완료 후 확인
- https://mosi-second-job.pages.dev 정상 접속
- 카툰 생성 기능 작동 확인
- 뉴스 조회 기능 작동 확인