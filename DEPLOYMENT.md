# Firebase 배포 가이드

## 준비사항
1. Firebase 프로젝트 생성 (https://console.firebase.google.com/)
2. Firebase CLI 설치 완료 ✅

## 배포 단계

### 1. Firebase 로그인
```bash
firebase login
```

### 2. Firebase 프로젝트 초기화
```bash
firebase init hosting
```
- 기존 프로젝트 선택 또는 새 프로젝트 생성
- Public directory: `dist` (이미 설정됨)
- Single-page app: `Yes`
- GitHub 자동 배포: 선택사항

### 3. 프로젝트 빌드
```bash
npm run build
```

### 4. 배포
```bash
firebase deploy
```

## 주요 파일
- `firebase.json`: Firebase 설정 파일 ✅
- `dist/`: 빌드된 파일들이 저장되는 폴더

## 추후 배포
코드 변경 후 재배포할 때:
```bash
npm run build
firebase deploy
```

## 주의사항
- OpenAI API 키를 환경변수로 설정해야 합니다
- 현재는 Mock 데이터로 작동하므로 실제 API 연동 필요