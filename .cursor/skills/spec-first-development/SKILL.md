---
name: spec-first-development
description: Spec-driven development workflow for Baozi HSK 3. Use when implementing new features, modifying UI, changing behavior, or fixing bugs. Enforces the Spec → Dev → Verify → Build loop.
---

# Spec-First Development

## Workflow

### Step 1: Spec (요구사항 확인)
1. `docs/DESIGN_SPEC.md` 또는 관련 `docs/tabs/*.md` 읽기
2. 요구사항이 스펙에 없으면 스펙 문서 먼저 업데이트
3. 스펙이 명확해질 때까지 코드 변경 금지

### Step 2: Dev (구현)
1. 스펙에 따라 코드 구현
2. 디자인 시스템 준수 (`.ios-card`, 색상 체계, 스페이싱)
3. E2E 테스트 추가/업데이트 (`tests/*.spec.ts`)
4. 타입 안전성 유지 (`types/index.ts`)

### Step 3: Verify (검증)
```bash
npm run verify
```
이 명령은 순서대로 실행:
1. `npm run typecheck` - TypeScript 컴파일 검증
2. `npm run lint` - ESLint 코드 품질 검사
3. `npm run test:e2e` - Playwright E2E 테스트

실패 시 → 로그 분석 → 수정 → 재실행 (통과할 때까지 반복)

### Step 4: Build (빌드)
```bash
npm run build
```
프로덕션 빌드 성공 확인. 정적 생성 오류나 라우트 설정 문제 확인.

## 스펙 파일 맵

| 작업 대상 | 참조 스펙 |
|-----------|-----------|
| 대시보드 | `docs/tabs/DASHBOARD.md` |
| 단어장 | `docs/tabs/VOCABULARY.md` |
| 문장 | `docs/tabs/SENTENCES.md` |
| 독해 | `docs/tabs/READING.md` |
| 작문 | `docs/tabs/WRITING.md` |
| 전체/디자인 시스템 | `docs/DESIGN_SPEC.md` |
| 데이터 모델 | `types/index.ts` + `docs/DESIGN_SPEC.md` Data Models |

## 스펙 업데이트 규칙
- 새 기능 추가 → 스펙에 반드시 문서화
- UI 변경 → 스펙의 컴포넌트 구조 업데이트
- 동작 변경 → Behavior Flow 섹션 업데이트
- `docs/DESIGN_SPEC.md` 버전 번호 및 Version History 업데이트
