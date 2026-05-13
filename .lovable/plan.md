# Settings 서브 메뉴 모바일 미작동 수정

## 문제
모바일에서 우측 상단 설정(Cog)을 탭하면 메뉴(Manual / Templates / Pilot / Reset / Revert / Logout)는 펼쳐지지만, 각 항목을 탭해도 아무 동작이 일어나지 않음.

## 원인
`HeaderBar.tsx`의 `SubIcon` 컴포넌트는 각 버튼을 Radix `Tooltip`으로 감싸고 있음. 터치 디바이스에서는 일반적으로:
1. 첫 번째 탭 → 호버 에뮬레이션으로 Tooltip만 열림 (`click` 이벤트가 합성되지 않거나 무시됨)
2. 두 번째 탭이 있어야 onClick 발화

서브 메뉴는 한 번 탭하면 닫히도록 설계되어 있어, 사용자는 사실상 버튼을 누를 수가 없음. (Cog 본체는 Tooltip이 `hubOpen`일 때 숨겨져 있어서 정상 동작함.)

## 수정 방향

### 1) SubIcon에서 모바일 시 Tooltip 비활성화
- `useIsMobile()` 훅 사용 (`src/hooks/use-mobile.tsx` 이미 존재).
- 모바일이면 Tooltip 래퍼 없이 `motion.button`만 렌더 → 첫 탭에서 바로 onClick 발화.
- 데스크톱은 기존 Tooltip 동작 유지 (라벨 가독성).
- 모바일에서는 라벨이 안 보이는 대신, 메뉴가 아이콘만 6개여서 방향성을 강화하기 위해 아이콘 옆에 작은 텍스트 라벨을 표시하거나 그대로 두는 두 가지 옵션이 있음 — 일단은 그대로 아이콘만 유지(현재 데스크톱과 동일한 시각).

### 2) 보조: outside-click 핸들러를 `pointerdown`으로 변경 (선택)
- 현재 `mousedown` 리스너 사용. 터치에서도 `mousedown`이 합성되긴 하지만, 일부 기기/브라우저에서 타이밍 차이로 클릭 직전에 패널이 닫힐 수 있음.
- `mousedown` → `pointerdown`으로 통일하면 터치/마우스 모두 일관되게 동작.
- ManualPanel, TemplatePanel, hub 외부 클릭 3곳 적용.

## 변경 파일
- `src/components/HeaderBar.tsx`
  - `SubIcon`에 `useIsMobile()` 분기 추가
  - 외부 클릭 감지 3곳을 `pointerdown`으로 변경

## 검증
1. 모바일 뷰포트(390px)에서 Cog 탭 → 서브 메뉴 펼침
2. Manual / Templates / Pilot Profile / Reset / Logout 각각 첫 탭에 동작
3. 데스크톱에서는 기존 hover Tooltip 정상 표시
