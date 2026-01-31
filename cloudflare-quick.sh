#!/bin/bash

echo "🔑 Cloudflare API 토큰 빠른 생성 가이드"
echo "======================================"
echo ""

echo "1️⃣ Cloudflare 로그인:"
echo "   https://dash.cloudflare.com"
echo ""

echo "2️⃣ API 토큰 생성:"
echo "   프로필 → My Profile → API Tokens → Create Token"
echo ""

echo "3️⃣ 권한 설정 (선택 1):"
echo "   템플릿: 'Cloudflare Pages:Edit'"
echo "   계정: All accounts"
echo ""

echo "4️⃣ 토큰 복사:"
echo "   생성된 토큰 즉시 복사 (다시 표시 안됨!)"
echo ""

echo "5️⃣ GitHub에 등록:"
echo "   https://github.com/moses-song/mosi-second-job/settings/secrets/actions"
echo "   - CLOUDFLARE_API_TOKEN: [복사한 토큰]"
echo "   - CLOUDFLARE_ACCOUNT_ID: [대시보드에서 확인]"
echo ""

echo "⚡ 즉시 수동 배포 (API 토큰 없이도 가능):"
echo ""
echo "📱 프론트엔드:"
echo "   1. https://dash.cloudflare.com/pages"
echo "   2. Upload assets → digital-health-cartoon/frontend/dist/ 업로드"
echo "   3. 프로젝트명: mosi-second-job"
echo ""

echo "🔧 백엔드:"
echo "   1. https://dash.cloudflare.com/workers"
echo "   2. Create Application"
echo "   3. cloudflare-worker/src/index.js 코드 붙여넣기"
echo "   4. 환경변수 설정:"
echo "      GEMINI_API_KEY=AIzaSyBPFlxm8zvR7aHqS-1Tfuh5Ps24MRMs8Q8"
echo "      YOUTUBE_API_KEY=AIzaSyDAMWthh8vcjvjuBS2lZHwzp_NCR5xrKUk"
echo ""

echo "💰 비용: 무료 플랜으로 충분!"
echo "   - Pages: 무제한 호스팅"
echo "   - Workers: 월 10만 요청 무료"
echo ""