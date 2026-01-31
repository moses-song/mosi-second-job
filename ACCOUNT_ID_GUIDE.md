# Cloudflare Account ID 찾는 방법

## 📍 Account ID 위치 (여기 있어요!)

### 방법 1: 대시보드 우측 하단
```
https://dash.cloudflare.com 로그인 후
↓
우측 하단 스크롤
↓ 
"Account ID" 섹션에서 복사 가능

예시:
┌─────────────────────────────┐
│  Account ID                 │
│  a1b2c3d4e5f6g7h8i9j0k1l2 │  ← 이것!
│  [복사 버튼]                │
└─────────────────────────────┘
```

### 방법 2: URL에서 확인
```
https://dash.cloudflare.com/a1b2c3d4e5f6g7h8i9j0k1l2
                                   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                이 부분이 Account ID
```

### 방법 3: 오른쪽 사이드바
```
대시보드 접속 시
오른쪽에 있는 정보 패널 하단에
"Account ID" 항목 확인
```

## 🔍 만약 안 보인다면

### 1. 로그인 확인
- Cloudflare에 정상적으로 로그인되었는지 확인
- 이메일 인증 완료 여부 확인

### 2. 권한 확인
- 계정이 Full Access 권한인지 확인
- 제한된 계정일 경우 Account ID 접근 제한

### 3. 브라우저 확대/축소
- 브라우저 화면을 100%로 설정
- 페이지 하단까지 완전히 스크롤

### 4. 다른 방법으로 찾기
```
1. Workers 페이지로 이동
   https://dash.cloudflare.com/workers
2. 개발자 도구 열기 (F12)
3. Console 탭에서 입력:
   location.href
4. URL에서 ID 추출
```

## ⚡ 빠른 테스트
계정 ID를 모를 경우, 일단 Workers API부터 테스트:

```
https://dash.cloudflare.com/workers
→ Create Application
→ Hello World 생성
→ 여기서 Account ID 확인 가능
```

## 📱 모바일 앱 사용 시
- Cloudflare 앱 실행
- 메뉴 → 계정 정보
- Account ID 항목 찾기

---

**💡 팁**: Account ID는 32자리 영문+숫자 조합입니다.