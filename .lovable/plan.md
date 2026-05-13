## 문제

상단 좌측 파일럿 칩의 아바타 썸네일에:
1. 얼굴 뒤에 검은색 정사각형(컨테이너 `bg-background`)이 그대로 보임 — 칩의 어두운 배경과 분리되어 액자처럼 떠 보임
2. `crop="face"` 모드에서 `translateY(18%)`로 머리가 박스 상단에 쏠려 있어 위·아래 여백이 비대칭

## 변경 범위

오직 **HeaderBar 좌상단 파일럿 칩**의 아바타 표시만 손봄. 온보딩/프로필 패널 등 다른 위치의 `PilotAvatar`는 영향 없음.

### 1. `src/components/PilotAvatar.tsx`
- 컨테이너의 하드코딩된 `bg-background` 제거 → `bg-transparent`로 바꾸거나, `bordered` 옵션과 같은 패턴으로 `transparent?: boolean` (기본 false=현행 유지) 프롭 추가.
  - 다른 사용처에서는 어두운 배경이 필요할 수 있으므로 **프롭 추가 방식**이 안전. (e.g. `transparent={true}` 시 `bg-transparent`)
- `crop="face"` 변환값 조정: `translateY(18%)` → `translateY(8%)` 정도로 완화하여 머리가 박스 수직 중앙에 오도록 함. (대부분 PNG가 상단에 머리/하단에 몸통을 갖는 구조이므로 살짝만 끌어내림)

### 2. `src/components/HeaderBar.tsx` 칩
- `<PilotAvatar ... bordered={false} transparent />`로 호출하여 검은 배경 제거.
- 칩 외곽은 그대로(테두리/blur/패딩 유지). 결과: 얼굴이 칩 배경 위에 자연스럽게 떠서 액자감 사라짐, 위·아래 균등.

## 영향 없음

- `PilotProfilePanel`, 온보딩 그리드, 기타 `PilotAvatar` 호출처는 기본값 그대로 → 시각 변화 없음.
- 칩 외곽 보더, 콜사인 타이포, 패딩 변경 없음.
