확인한 내용
- 현재 미리보기 코드에서는 상단 탭 버튼 클릭은 전환되는 것을 확인했습니다.
- 하지만 CORE 요약 카드 클릭은 자동화 도구가 상단 탭으로 오인/대체해서 클릭하는 현상이 보여, 실제 문제 경로가 아직 안정적으로 검증되지 않았습니다.
- 게시된 URL은 로그인 화면이라 동일 상태로 바로 비교 검증할 수 없었습니다. 사용자가 본 “아바타 추가 전 버전”은 게시본/캐시/로그인 상태 차이일 가능성이 큽니다.
- 코드상 취약점은 `MobileCategoryTabs`가 탭 상태를 내부 `selectedTab`로만 들고 있고, 모바일에서 `pointerdown + click` 중복/스크롤 컨테이너/부모 이벤트와 충돌했을 때 CORE 카드 전환이 보장되지 않는 구조입니다.

수정 범위
1. `MobileCategoryTabs.tsx`만 수정합니다.
2. 탭 전환을 `button onPointerDown/onClick`에만 의존하지 않고, 모바일 컨테이너의 capture 단계에서 `data-mobile-tab` 속성을 읽어 선처리합니다.
3. 모든 탭 버튼과 CORE 요약 카드에 `data-mobile-tab`을 부여합니다.
4. `selectTab`은 다음을 한 번에 처리합니다.
   - `selectedTab` 즉시 변경
   - `sessionStorage` 즉시 저장
   - 탭 전환 시 열려 있던 action drawer가 있으면 부모의 `onBlockClick` 경로와 충돌하지 않도록 별도 action focus는 건드리지 않음
5. `preventDefault()`는 사용하지 않습니다. 대신 capture에서 `stopPropagation()`만 제한적으로 사용해 상위/문서 pointerdown 핸들러가 먼저 닫거나 삼키는 문제를 막습니다.
6. CORE 카드 클릭 경로는 `onPointerUp/onClick` fallback도 유지해서 iOS Safari/Android Chrome 모두에서 동작하게 합니다.

검증 기준
- 390x844 모바일 미리보기에서 다음을 각각 확인합니다.
  1. CORE 탭 → CORE 요약 표시
  2. 상단 HE 탭 → HEALTH 3x3 grid 표시
  3. 상단 CA 탭 → CAREER 3x3 grid 표시
  4. CORE 요약의 HE HEALTH 카드 → HEALTH 3x3 grid 표시
  5. CORE 요약의 CA CAREER 카드 → CAREER 3x3 grid 표시
  6. subgoal grid 안 체크박스 탭은 여전히 action toggle로 동작
- 게시본은 publish 전에는 업데이트되지 않으므로, 수정 후 폰에서는 Preview URL로 확인하고, 게시본 확인은 publish 이후에만 합니다.