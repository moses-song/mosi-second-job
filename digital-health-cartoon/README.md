# Digital Health Cartoon

매일 최신 디지털 헬스케어 정보를 4-8장의 카툰으로 생성하는 웹 애플리케이션

## 🚀 빠른 시작

### 1. 환경 설정
```bash
# 복제
cd digital-health-cartoon

# 백엔드 설정
cd backend
npm install
cp .env.example .env
# .env 파일에 API 키 입력
```

### 2. 필요한 API 키
- **OpenAI API Key**: DALL-E 3와 GPT-4 사용
- **YouTube Data API Key**: 최신 영상 정보 수집

### 3. 서버 실행
```bash
# 백엔드
cd backend
npm run dev

# 프론트엔드 (새 터미널)
cd frontend
npm install
npm run dev
```

## 🎯 주요 기능

1. **자동 뉴스 수집**: RSS 피드에서 디지털 헬스케어 뉴스 자동 수집
2. **AI 카툰 생성**: GPT-4 시나리오 작성 + DALL-E 3 이미지 생성
3. **유튜브 연동**: 관련 최신 영상 정보 표시
4. **매일 자동 업데이트**: 8AM KST에 자동 카툰 생성
5. **데이터베이스 저장**: SQLite로 생성된 카툰 영구 저장

## 🏗️ 기술 스택

### Frontend
- React + TypeScript
- Vite (빌드 도구)
- Tailwind CSS

### Backend
- Node.js + Express + TypeScript
- SQLite (데이터베이스)
- node-cron (스케줄러)

### AI/External APIs
- OpenAI (GPT-4, DALL-E 3)
- YouTube Data API v3
- RSS Parser

## 📁 프로젝트 구조
```
digital-health-cartoon/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   ├── services/        # API 서비스
│   │   └── types/           # 타입 정의
│   └── package.json
├── backend/                  # Node.js 백엔드
│   ├── src/
│   │   ├── routes/          # API 라우트
│   │   ├── services/        # 비즈니스 로직
│   │   └── models/          # 데이터 모델
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🎨 카툰 생성 과정

1. **뉴스 수집**: 5개 주요 헬스케어 RSS 피드에서 최신 뉴스 수집
2. **필터링**: 디지털 헬스케어 관련 뉴스만 필터링
3. **시나리오 생성**: GPT-4로 4-6장면 카툰 시나리오 작성
4. **이미지 생성**: 각 장면별 DALL-E 3 이미지 생성
5. **저장**: 데이터베이스에 카툰 정보 저장

## 📅 자동화 스케줄

- **매일 8AM KST**: 자동 카툰 생성
- **6시간마다**: 뉴스 캐시 업데이트
- **개발 모드**: 수동 테스트 API 제공 (`/api/test-generation`)

## 🔧 API 엔드포인트

### 카툰
- `POST /api/cartoons/generate` - 새 카툰 생성
- `GET /api/cartoons/latest` - 최신 카툰 조회
- `GET /api/cartoons/summary` - 뉴스 요약

### 뉴스
- `GET /api/news/latest` - 최신 뉴스
- `GET /api/news/youtube` - 유튜브 영상

## 🚀 배포

### 개발 환경
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### 프로덕션
- Vercel (Frontend)
- Railway/Heroku (Backend)
- 환경 변수에 API 키 설정 필수

## 📝 라이선스

MIT License