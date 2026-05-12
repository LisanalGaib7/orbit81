# 신규 캐릭터 + 그리드 + COMET 수정

## 변경 내역

### 1. 신규 캐릭터 — CORGI (우주복 입은 웰시코기)
- **ID**: `corgi`
- **이름**: `CORGI`
- **태그라인**: `Good boy. Great pilot.`
- **액센트 컬러**: `#F4A24C` (웰시코기 골드/탠 톤)
- **이미지 디자인**: 업로드 레퍼런스의 chibi 도트 스타일에 맞춰 우주복 입은 웰시코기 (짧은 다리, 큰 귀, 골드+화이트 털, 작은 헬멧 옆에). 검정 배경.
- **파일**: `src/assets/avatars/corgi.png`
- `src/assets/avatars/index.ts`에 import + AvatarId 타입 + AVATARS 배열에 추가

### 2. 캐릭터 선택 그리드 → 3x3
- 현재: PilotOnboarding은 `grid-cols-2 sm:grid-cols-4`, PilotProfilePanel은 `grid-cols-4` (2행 4열)
- 변경: 두 파일 모두 **`grid-cols-3`** 으로 통일 → 9개 캐릭터가 3x3로 깔끔히 배치
- 모바일에서도 3열 유지 (셀이 살짝 작아지지만 9칸 균형 우선)

### 3. COMET 얼굴 — 귀엽고 시크하게 재디자인
- 현재 문제: 표정/이목구비 비율이 어색함
- 변경:
  - 얼굴형 기본 chibi 둥글기로 복원 (너무 갸름·각진 느낌 X)
  - **귀여운 눈매** (살짝 큰 눈) + 차분하고 **시크한 무표정에 가까운 옅은 미소**
  - 눈썹 자연스러운 곡선, 입은 작고 단정하게
  - 한쪽 볼터치 살짝
- 머리/슈트/포즈/배경: 그대로 (붉은 머리 휘날림, 빨간 #12 레이싱 슈트, 검정 배경)

## 기술 노트

- `imagegen--edit_image` 사용 (CORGI는 레퍼런스 기반 신규 생성, COMET은 기존 편집)
- 코드 변경 파일:
  - `src/assets/avatars/index.ts` — corgi 추가
  - `src/components/PilotOnboarding.tsx` — 그리드 클래스 수정
  - `src/components/PilotProfilePanel.tsx` — 그리드 클래스 수정
- DB schema/타입 변경 없음 (avatar_id는 string)

## 작업 범위 외

- 다른 캐릭터(NOVA/EMBER/NEBULA/DRIFT/RELIC/PIXEL/AURORA) 변경 없음
- 컴포넌트 로직, 헤더, 상세 패널 디자인 변경 없음
