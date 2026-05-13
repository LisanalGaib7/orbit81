## 진단

`src/assets/avatars/*.png` 9개가 **각각 1024×1024, 700–934KB** PNG입니다(총 ~7.2MB). 프로필 패널을 열면 9개 그리드가 동시에 렌더되어 lazy-load가 즉시 트리거 → 모바일에서 큰 다운로드 + 디코드 → "변경 시 매우 느림" 체감.

표시 크기는 매우 작음:
- 헤더 칩: 44px
- 프로필 그리드: 56px
- 온보딩 그리드: 비슷한 작은 사이즈

`image-rendering: pixelated` 픽셀아트라서 **원본을 작게 만들어도 화질 손실이 없음**(오히려 더 또렷한 픽셀룩). 1024px는 과잉.

## 해결 방안 (가장 단순/효과 큰 순)

### 1. 원본 PNG를 256×256으로 다운샘플 + 팔레트 양자화
- `sharp`로 일회성 변환:
  - resize 256×256 (nearest-neighbor → 픽셀룩 보존)
  - PNG palette/8-bit + pngquant 수준 압축
- 예상 결과: 파일당 ~10–25KB, 9개 합쳐 ~150KB (47× 감소)
- 변환된 파일을 그대로 `src/assets/avatars/*.png`에 덮어씀 → 코드 변경 없음
- 원본이 필요할 경우를 대비해 변환 전 `src/assets/avatars/_orig/`에 백업

### 2. 프로필 그리드의 동시 디코드 부담 완화
- `PilotAvatar`의 `<img>`에 `decoding="async"` 명시 추가 (이미 `loading="lazy"` 있음)
- 프로필 그리드 썸네일은 항상 화면에 보이므로 lazy → eager로 바꿔도 무방하지만, 1번 변경 후 용량이 충분히 작아지면 추가 조치 불필요

### 3. (선택) face crop 호버/선택 시 reflow 방지
- 변경 없음. 1번만으로 체감 속도 충분히 회복.

## 변경 범위

- **에셋만 교체**: `src/assets/avatars/*.png` (9개) → 256×256, 양자화 PNG
- (선택) `src/components/PilotAvatar.tsx`의 `<img>`에 `decoding="async"` 한 줄 추가
- 백업: `src/assets/avatars/_orig/` 폴더에 원본 보존 (Vite import 영향 없음 — index.ts만 빌드에 포함됨)
- 코드 로직/UI 변경 없음. 모든 사용처(헤더 칩, 온보딩, 프로필) 자동 적용.

## 위험

- 픽셀아트가 아닌 디테일한 일러스트라면 256px가 부족할 수 있음 → 그 경우 384×384로 fallback. 먼저 256으로 변환해 보고 시각 QA 후 결정.

## 실행

1. `sharp` 스크립트로 9개 변환 + 백업
2. `du -sh` 로 새 용량 확인
3. 변환된 한 두 장을 시각 점검 (스크린샷)
4. 필요 시 `decoding="async"` 추가
