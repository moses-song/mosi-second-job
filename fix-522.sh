#!/bin/bash

echo "🚨 Error 522 즉시 해결 스크립트"
echo "================================"
echo ""

echo "📋 문제 상태:"
echo "- Cloudflare Pages: GitHub Actions 실패로 배포 안됨"
echo "- Workers API: 아직 배포 안됨"  
echo "- 현재 접속: 522 에러 발생"
echo ""

echo "🔧 1단계: 프론트엔드 빌드 파일 확인"
ls -la digital-health-cartoon/frontend/dist/
echo ""

echo "📦 2단계: 수동 배포 준비"
echo "빌드 파일이 준비되었습니다. Cloudflare Pages 대시보드에서 직접 배포하세요:"
echo ""
echo "1. https://dash.cloudflare.com/pages 접속"
echo "2. 'Create a project' → 'Upload assets'"
echo "3. digital-health-cartoon/frontend/dist/ 폴더 업로드"
echo "4. 프로젝트 이름: mosi-second-job"
echo ""

echo "🌐 3단계: Workers API 배포"
echo "cloudflare-worker/ 폴더 내용으로 Workers 배포 필요"
echo ""

echo "⚡ 즉시 테스트 방법:"
echo "로컬 서버 실행:"
echo "cd digital-health-cartoon/frontend && npm run dev"
echo "cd digital-health-cartoon/backend && npm run dev"
echo "접속: http://localhost:5173"
echo ""

echo "✅ 필요한 API 키:"
echo "- GEMINI_API_KEY: AIzaSyBPFlxm8zvR7aHqS-1Tfuh5Ps24MRMs8Q8"
echo "- YOUTUBE_API_KEY: AIzaSyDAMWthh8vcjvjuBS2lZHwzp_NCR5xrKUk"
echo ""