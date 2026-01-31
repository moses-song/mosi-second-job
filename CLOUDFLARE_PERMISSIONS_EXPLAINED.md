# Cloudflare API 토큰 권한 정확한 정보

## 🎯 당신이 필요한 최소 권한

Workers 페이지와 Pages를 편집하려면 다음 권한이 필요합니다:

### ⚡ Workers 편집을 위한 필수 권한
```
✅ Workers Scripts Read
✅ Workers Scripts Edit  
✅ Workers KV Storage Read
✅ Workers KV Storage Edit
✅ Workers R2 Storage Read (선택사항)
✅ Workers R2 Storage Edit (선택사항)
```

### 🌐 Pages 편집을 위한 필수 권한
```
✅ Cloudflare Pages Read
✅ Cloudflare Pages Edit
```

## 🔑 생성해야 할 API 토큰 종류

### 옵션 1: Custom Token (권장)
```
1. 프로필 → API Tokens → Create Token → Custom token
2. 권한 선택:
   - Account permissions:
     ✓ Cloudflare Pages:Edit
     ✓ Workers Scripts:Edit
     ✓ Workers KV Storage:Edit
   - Account Resources:
     ✓ Include All accounts
   - Zone Resources:
     ✓ Include All zones (선택사항)
```

### 옵션 2: 미리 만들어진 템플릿
```
- "Custom token"으로 가는 것이 더 안전하고 확실함
- 기존 템플릿은 너무 많거나 부족한 권한일 수 있음
```

## 🔍 계정 권한 문제 진단

### 만약 Workers가 보이지 않는다면:
```
1. 계정 종류 확인:
   - Organization 계정인가?
   - 권한이 제한된 계정인가?
   - Full Access 권한을 가지고 있는가?

2. 해결책:
   - 계정 소유자에게 권한 요청
   - 또는 새로운 개인 계정 생성 (권장)
```

### 직접 확인 방법:
```
1. https://dash.cloudflare.com/workers 접속
2. "Create application" 버튼이 보이나요?
   - 보이면 권한 있음
   - 안 보이면 권한 없음
```

## 🚀 즉시 조치 방법

### 방법 1: 새 계정으로 API 토큰 생성
```
1. 완전 새로운 이메일로 가입
2. https://dash.cloudflare.com/sign-up
3. Custom token으로 위 권한들 선택
4. GitHub Secrets에 새 토큰 등록
```

### 방법 2: 수동 배포로 우회
```
API 토큰 없이도 배포 가능!
프론트엔드: Pages 직접 업로드
백엔드: Workers 직접 코드 붙여넣기
```

## 💡 핵심 요약
**당신에게 필요한 권한**: Workers Scripts Edit + Cloudflare Pages Edit

**만약 안 보인다면**: 계정 권한 문제이거나 Organization 계정일 가능성이 높음

**가장 확실한 해결책**: 새 개인 계정으로 Full Access 확보