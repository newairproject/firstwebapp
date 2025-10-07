# GPT 채팅 웹앱

React + Vite로 구축된 대화형 GPT 인터페이스 웹앱입니다.

## 주요 기능

- 📝 **텍스트 입력**: 사용자 정의 프롬프트와 함께 텍스트 메시지 전송
- 🖼️ **이미지 업로드**: 이미지 분석을 위한 파일 업로드 기능
- ⚙️ **프롬프트 관리**: 프롬프트 등록, 수정, 삭제 기능
- 💾 **로컬 저장**: 대화 내역과 프롬프트를 로컬스토리지에 저장
- 🎨 **깔끔한 UI**: Tailwind CSS를 사용한 모던한 인터페이스

## 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: LocalStorage
- **Deploy**: Firebase Hosting

## 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

## 사용 방법

1. **프롬프트 설정**: '프롬프트 관리' 버튼을 클릭하여 사용할 프롬프트를 선택하거나 새로 생성
2. **메시지 전송**: 텍스트 입력 또는 이미지 업로드로 메시지 전송
3. **대화 확인**: AI의 응답을 실시간으로 확인

## API 연동

현재는 Mock 데이터로 작동합니다. 실제 OpenAI API를 사용하려면:

1. OpenAI API 키 발급
2. `src/services/api.ts`에서 실제 API 연동 코드 활성화
3. 환경변수로 API 키 설정

## 배포

Firebase Hosting을 사용한 배포 가이드는 `DEPLOYMENT.md`를 참조하세요.

## 폴더 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ChatInterface.tsx
│   └── PromptManager.tsx
├── services/           # API 서비스
│   └── api.ts
├── types/             # TypeScript 타입 정의
│   └── index.ts
├── utils/             # 유틸리티 함수
│   └── storage.ts
└── App.tsx           # 메인 앱 컴포넌트
```

## 라이선스

MIT License
