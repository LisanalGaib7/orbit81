## 목표

`HeaderBar`의 좌측 파일럿 칩과 우측 Settings 톱니바퀴가 현재 `position: fixed`로 뷰포트에 박혀 있어 스크롤해도 계속 따라옵니다. 이를 **페이지 상단(문서 최상단)에만 위치**하도록 바꿔 스크롤하면 자연스럽게 화면 밖으로 사라지게 합니다.

## 변경 내역

### `src/components/HeaderBar.tsx`

1. **createPortal 제거** — `document.body` 포털로 렌더링하면 항상 뷰포트 기준으로 떠 있게 되므로, 일반 자식 노드로 변경해 페이지 흐름 안에 배치합니다.
2. **클래스 변경**:
   - 좌측 파일럿 칩: `!fixed top-8 left-8` → `absolute top-8 left-8` (모바일도 `max-md:top-4 max-md:left-4` 동일하게 absolute로)
   - 우측 톱니 컨테이너: `!fixed top-8 right-8` → `absolute top-8 right-8`
3. **부모 컨테이너 확인** — `HeaderBar`를 호출하는 곳(`src/pages/Index.tsx` 등)에 `relative` 부모가 있는지 확인하고, 없으면 최상위 wrapper에 `relative` 추가하여 absolute 기준점이 문서 최상단이 되게 합니다.
4. **Manual / Profile 모달, Sub-menu fly-out**은 그대로 유지 — 이들은 모달이라 뷰포트 fixed가 적절하므로 영향 없음. (Manual/Template/Profile 패널 자체 portal은 유지)

### 기술 메모

- 톱니 버튼의 sub-menu fly-out(`absolute right-0 top-full`)은 이미 부모 기준이라 변경 불필요.
- z-index는 페이지 내 다른 요소를 덮을 수 있도록 `z-50` 정도로 낮춥니다(기존 z-[9999]는 portal용 과한 값).
- 모바일/데스크탑 spacing(top-4 / top-8)은 그대로 유지.

## 영향 범위

- `src/components/HeaderBar.tsx` — 위 수정
- `src/pages/Index.tsx` (또는 HeaderBar 부모) — 필요 시 `relative` 추가만
