---
name: verify-and-build
description: Verification and build pipeline for Baozi HSK 3. Use when running tests, checking code quality, debugging build failures, or preparing for deployment. Covers typecheck, lint, E2E tests, and production build.
---

# Verify & Build Pipeline

## Quick Reference

| 명령어 | 설명 |
|--------|------|
| `npm run typecheck` | TypeScript 컴파일 검증 (`tsc --noEmit`) |
| `npm run lint` | ESLint 코드 품질 검사 |
| `npm run test:e2e` | Playwright E2E 테스트 (headless) |
| `npm run test:e2e:ui` | Playwright UI 모드 (디버깅용) |
| `npm run verify` | typecheck + lint + test:e2e 통합 실행 |
| `npm run build` | Next.js 프로덕션 빌드 |

## 검증 순서

```
typecheck → lint → test:e2e → build
```

하나라도 실패하면 다음 단계로 진행하지 않고 수정.

## 일반적인 오류 및 해결

### TypeScript 오류
- 타입 불일치: `types/index.ts` 확인 후 인터페이스 수정
- 누락된 프로퍼티: 옵셔널(`?`) 처리 또는 기본값 제공
- `any` 사용: 구체적 타입으로 교체

### ESLint 오류
- unused imports: 제거
- React Hook 의존성: useEffect/useCallback deps 배열 수정
- `@next/next` 규칙: Next.js 권장 패턴 적용

### Playwright 오류
- 타임아웃: `page.waitForLoadState('networkidle')` 활용
- 셀렉터 미발견: `data-testid` 추가 또는 텍스트 기반 셀렉터
- 디버깅: `npm run test:e2e:ui` 로 UI 모드에서 단계별 확인

### Build 오류
- 동적 API 사용: `export const dynamic = 'force-dynamic'` 추가
- fs 모듈: API route에서만 사용 (클라이언트 컴포넌트 금지)
- 환경변수: `NEXT_PUBLIC_` 접두사 확인

## Playwright 설정 요약
- 브라우저: Chromium, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)
- CI: `forbidOnly`, 2 retries, 1 worker
- 로컬: retry 0, 병렬 실행
- 트레이스: 첫 번째 재시도 시 캡처
