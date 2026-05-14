## 목표
모바일, 웹, iPad에서 subgoal 탭/체크박스/설정 메뉴 아이콘이 첫 탭부터 안정적으로 작동하도록 클릭 이벤트 구조를 정리합니다.

## 확인된 핵심 원인 후보
- `SubGoalBlock`의 action slot `<div>`와 내부 `GoalCheckbox <button>`이 중첩 클릭 구조처럼 동작해, 체크 클릭이 사이드바 열기 이벤트와 충돌할 수 있습니다.
- 모바일 `MobileCategoryTabs`는 `AnimatePresence mode="wait"`와 탭 전환 애니메이션이 결합되어 탭 클릭 후 화면 전환이 안정적으로 반영되지 않는 상태가 보입니다.
- 설정 메뉴는 일부 패널 상태(`manualOpen`, `templateOpen`, `profileOpen`)와 hub 외부 클릭 처리, Tooltip/portal 조합이 여전히 상호 간섭할 수 있습니다.
- `ActionSidebar`가 `modal={false}`인 Radix Dialog로 열리고, 닫힌/열린 상태 전환 중 body scroll lock 및 포커스 관리가 다른 클릭을 방해할 가능성이 있습니다.

## 구현 계획
1. **체크박스 클릭 경로 분리**
   - `SubGoalBlock`에서 체크박스 자체 탭은 `toggleAction`만 실행되게 유지합니다.
   - 체크박스 주변 action slot 탭은 사이드바 열기만 실행되게 하고, 두 이벤트가 동시에 실행되지 않도록 `pointerdown/click` 전파를 명확히 차단합니다.
   - 웹/iPad에서 일부 체크만 안 눌리는 문제를 해결하기 위해 각 tile의 터치/클릭 영역 크기와 stacking을 고정합니다.

2. **모바일 탭 전환 안정화**
   - `MobileCategoryTabs`에서 탭 버튼을 `type="button"`으로 명시하고, 탭 클릭 시 active block/focus 상태를 함께 정리합니다.
   - 모바일 content 전환 애니메이션은 클릭을 막지 않도록 단순화하거나 `pointer-events`를 제어합니다.
   - CORE 요약 카드의 subgoal 버튼 클릭도 실제 selected tab 변경과 `activeBlockIndex` 정리가 함께 일어나도록 맞춥니다.

3. **설정 메뉴 이벤트 구조 재정리**
   - 모바일과 데스크톱 모두 설정 cog 및 하위 아이콘은 Tooltip이 클릭 이벤트를 감싸지 않는 순수 button 경로를 기본으로 정리합니다. 데스크톱 Tooltip은 hover-only 보조 UI로 유지하거나 안전한 wrapper만 사용합니다.
   - Manual, Templates, Pilot Profile, Reset, Revert, Logout 각각의 handler에서 다른 패널 상태를 먼저 닫고 자기 동작만 실행하게 통일합니다.
   - portal 모달의 backdrop/outside-click 로직은 “열린 직후 닫힘”과 “뒤쪽 메뉴가 클릭을 먹음”이 없도록 `pointerdown` 기준으로 정리합니다.

4. **사이드바가 전체 클릭을 막지 않게 조정**
   - `ActionSidebar`의 focus 자동 이동/scrollIntoView가 모바일 첫 탭을 방해하지 않도록 조건을 완화합니다.
   - 닫힌 뒤 body style이 반드시 복구되도록 유지하고, 필요 시 Sheet modal 설정을 클릭 가능한 구조로 바꿉니다.

5. **검증 항목**
   - 모바일 390px: CORE → 각 subgoal 탭 전환, CORE 요약 버튼 전환, subgoal 체크, action slot 사이드바 열기, settings 모든 아이콘 첫 탭 동작.
   - 웹/iPad: 3x3 grid의 모든 subgoal 체크 64개 중 여러 위치(모서리/중앙 주변/하단)가 정상 토글되는지 확인.
   - 설정 메뉴: Manual, Templates 선택, Pilot Profile, Reset 2-step, Revert, Logout 2-step이 클릭 이벤트를 잃지 않는지 확인.