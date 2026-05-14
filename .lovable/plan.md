## 확인한 실제 증상

- 상단 모바일 탭에서 **HE/Career 같은 subgoal 탭을 누르면 콘텐츠가 단일 subgoal 3x3 그리드로 전환**되는 케이스는 재현상 정상 동작을 확인했습니다.
- 하지만 **CORE 요약 영역 안의 subgoal 카드**를 누르면 화면이 여전히 CORE 요약에 머뭅니다.
- 그래서 사용자가 체감한 “subgoal 탭전환 안 됨”의 핵심은 상단 탭만이 아니라, **CORE 요약 안의 subgoal 진입 버튼이 탭처럼 보여도 전환되지 않는 것**입니다.

## 원인

- `MobileCategoryTabs.tsx` 안에 `data-mobile-tab-idx`를 가진 버튼이 두 종류 있습니다.
  1. 상단 가로 탭 버튼
  2. CORE 요약 아래의 subgoal 카드 버튼
- 현재 네이티브 capture listener는 `rootRef.current.contains(button)`만 통과하면 처리합니다.
- 그런데 CORE 요약 카드의 `pointerdown/touchstart/mousedown`은 React synthetic 이벤트의 `preventDefault()`/중복 방지 흐름과 섞이면서 실제 `selectedTab` 전환이 보장되지 않습니다.
- 특히 현재 구조는 native root listener + React capture handler + click fallback이 같은 버튼에 중복으로 붙어 있어서, 모바일 브라우저 이벤트 순서에 따라 의도와 다른 중복 억제가 발생할 여지가 큽니다.

## 수정 범위

1. **`src/components/MobileCategoryTabs.tsx`만 수정**합니다.
2. 탭 전환 함수를 단일화합니다.
   - `selectTab(idx)` 하나가 `selectedTab` 변경과 `sessionStorage` 저장을 책임지게 정리합니다.
   - pointer/touch/mouse/click 중복 방지는 이벤트 종류별 억제보다 “같은 idx의 짧은 중복만 무시”하는 단순 규칙으로 유지합니다.
3. 상단 탭과 CORE 요약 카드의 전환 처리를 분리합니다.
   - 상단 탭: native capture + React click fallback 유지.
   - CORE 요약 카드: `onPointerUp/onTouchEnd/onClick` 중심으로 처리해 실제 사용자의 탭 완료 시점에 전환되도록 보장합니다.
4. `event.preventDefault()`는 제거하거나 최소화합니다.
   - 모바일 touch/pointer에서 `preventDefault()`가 후속 click/mouse 이벤트를 막는 패턴이 있어서, 탭 전환에는 기본 동작 차단을 쓰지 않겠습니다.
5. 선택된 subgoal 콘텐츠 렌더링 조건을 명확하게 만듭니다.
   - `selectedTab === -1`이면 CORE 요약.
   - `selectedTab >= 0`이면 해당 subgoal 3x3 그리드.
   - `selectedIndex === null` 같은 도달 불가능한 조건은 제거합니다.

## 검증 기준

모바일 390px 폭에서 직접 확인합니다.

1. 초기 상태에서 CORE 요약이 보인다.
2. 상단 `HE 0%` 탭을 누르면 Health 3x3 그리드가 보인다.
3. 상단 `CA 0%` 탭을 누르면 Career 3x3 그리드가 보인다.
4. 상단 `⊕` CORE 탭을 누르면 CORE 요약으로 돌아온다.
5. CORE 요약 안의 `HE HEALTH 0/8` 카드를 누르면 Health 3x3 그리드로 전환된다.
6. 전환 후 체크박스 탭은 기존처럼 action toggle만 수행하고, 탭 전환 로직과 충돌하지 않는다.

## 비수정 범위

- 디자인, 색상, 레이아웃, 저장 로직, action/sidebar 로직은 건드리지 않습니다.
- `GoalMatrix`, `SubGoalBlock`, `useMissionProgress`는 현재 원인 범위 밖이므로 수정하지 않습니다.