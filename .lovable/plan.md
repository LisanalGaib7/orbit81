# Plan: Lofi 픽셀 우주비행사 아바타 선택 시스템

## 목표

신규 가입자가 가입 직후 8종의 lofi 감성 도트 우주비행사 캐릭터 중 하나를 골라 자신의 분신으로 삼고, 콜사인(닉네임)도 함께 정한다. 이후에도 설정에서 언제든 변경 가능.

## 사용자 흐름

```text
회원가입 → 로그인 성공
   ↓
[프로필 미완성 감지]
   ↓
온보딩 화면 (Pilot Enrollment)
   ├─ Step 1: 8명의 우주비행사 카드 그리드 (lofi 픽셀)
   │          ↓ 선택 시 카드 글로우 + 미리보기 확대
   └─ Step 2: 콜사인 입력 ("PILOT NAME")
        ↓
   "DEPLOY TO ORBIT" 버튼
        ↓
메인 화면 (Index)
   └─ HeaderBar의 Settings(⚙) → 새 항목 "Pilot Profile"
        └─ 아바타·콜사인 변경 가능
```

## 8종 캐릭터 컨셉 (lofi 픽셀 아트)

각각 색상·실루엣·소품으로 구분되는 우주비행사. AI 이미지 생성으로 `src/assets/avatars/`에 PNG로 저장.


| #   | 코드명    | 비주얼 컨셉                 |
| --- | ------ | ---------------------- |
| 1   | NOVA   | 클래식 화이트 슈트 + 골드 바이저    |
| 2   | EMBER  | 오렌지 슈트 + 헤드폰, lofi 감성  |
| 3   | NEBULA | 보라/핑크 슈트 + 별빛 패턴       |
| 4   | DRIFT  | 청록 슈트 + 떠다니는 머플러       |
| 5   | RELIC  | 빈티지 브론즈 슈트 + 호기심 많은 표정 |
| 6   | PIXEL  | 모노크롬 화이트/블랙 + 미니멀      |
| 7   | AURORA | 그린 슈트 + 오로라 글로우 바이저    |
| 8   | COMET  | 레드 슈트 + 별 모양 패치, 활기찬   |


전부 동일 캔버스(예: 256×256), 정면 흉상 컷, 검정 배경 위 픽셀화된 lofi 톤(부드러운 그레인, 따뜻한 하이라이트), 같은 파이프라인으로 생성해 통일감 확보.

## 데이터 모델 (백엔드)

기존 `profiles` 테이블 활용 — 스키마 변경 없음.

- `call_sign` (text, 기존) → 콜사인 저장
- `avatar_config` (jsonb, 기존) → `{ "avatar_id": "nova" | "ember" | ... , "selected_at": ISO }`로 저장
- "온보딩 완료" 판정: `avatar_config.avatar_id`가 존재하면 완료로 간주 (별도 플래그 불필요).

## 컴포넌트 구조

```text
src/
├── assets/avatars/
│   ├── nova.png ... comet.png        # 8개 lofi 픽셀 캐릭터
│   └── index.ts                      # AVATARS 카탈로그 (id, name, src, tagline)
├── components/
│   ├── PilotAvatar.tsx               # 아바타 표시 (id → img), 크기/글로우 prop
│   ├── PilotOnboarding.tsx           # 가입 직후 풀스크린 온보딩 (2-step)
│   └── PilotProfilePanel.tsx         # 설정에서 여는 프로필 편집 패널
├── hooks/
│   └── usePilotProfile.ts            # profiles 행 fetch/update + onboarding-필요 여부
└── pages/
    └── Index.tsx                     # 미완성 프로필이면 PilotOnboarding 렌더
```

## 핵심 UX 디테일

**온보딩 화면 (PilotEnrollment 톤과 일관)**

- 배경: 기존 Starfield + 헤더 "PILOT REGISTRATION TERMINAL"
- 캐릭터 그리드: 4×2 (모바일 2×4), 각 카드는 `image-rendering: pixelated`로 도트 보존
- 선택 시: 카드 골드 보더 + 글로우, 중앙 상단에 큰 미리보기(2×) + 캐릭터 코드명·짧은 태그라인 타이프라이터
- 콜사인 입력: 기존 데이터 폰트 사용, 16자 제한, 영문/숫자/공백
- 하단 CTA: `[ DEPLOY TO ORBIT → ]` (아바타+콜사인 모두 채워야 활성)
- 스킵 불가 (가입자만 한 번). 게스트 모드는 온보딩 건너뜀.

**설정에서 재변경**

- HeaderBar 서브 아이콘에 `User` 아이콘 추가 → "Pilot Profile"
- 동일 캐릭터 그리드 + 콜사인 입력을 패널로 재사용
- 저장 시 토스트 "PILOT PROFILE UPDATED"

**아바타 노출 위치**

- HeaderBar 우측에 현재 아바타 미니(28px) + 콜사인 표시 (모바일은 아바타만)
- 추후 로켓/HUD 영역에서도 재사용 가능 (이번 범위 밖)

## 구현 단계

1. **AI로 8종 lofi 픽셀 캐릭터 생성** → `src/assets/avatars/*.png` + `index.ts` 카탈로그
2. `**PilotAvatar` 컴포넌트** — 어디서든 `<PilotAvatar id="nova" size={64} />`
3. `**usePilotProfile` 훅** — Supabase에서 profile fetch, `needsOnboarding` 계산, `updateAvatar`/`updateCallSign` 노출
4. `**PilotOnboarding**` — 2-step 풀스크린, 저장 후 닫힘
5. `**Index.tsx` 게이팅** — `needsOnboarding && user`일 때 온보딩 표시
6. `**PilotProfilePanel**` — 설정 재변경 UI
7. **HeaderBar 통합** — Pilot Profile 서브아이콘 + 우측 아바타 칩 표시
8. **로딩/에러 토스트, 게스트 모드 분기 처리**

## 범위 외 (이번엔 안 함)

- 진척도 기반 슈트 색상 언락 (`unlocked_parts`)
- 아바타 커스터마이즈(파츠 조합)
- 다중 아바타 슬롯
- 로켓 본체에 아바타 그리기