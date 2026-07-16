# Orbit 81

The goal-planning method Shohei Ohtani famously used in high school — rebuilt as a space mission. Check off actions, fuel your rocket, launch at 100%.

**Live**: https://orbit81.vercel.app

English | [한국어](#orbit-81-한국어)

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple)

## Demo

_Demo assets coming soon._

<!-- TODO(demo): hero — desktop 9x9 grid overview
     ![Orbit 81 grid](docs/demo-desktop.png) -->

<!-- TODO(demo): core loop GIF — checking an action, watching progress/rocket evolve
     ![Orbit 81 core loop](docs/demo-loop.gif) -->

<!-- TODO(demo): mobile screen
     ![Orbit 81 mobile](docs/demo-mobile.png) -->

## Features

- 9x9 [mandalart](https://en.wikipedia.org/wiki/Mandala_chart) grid (a.k.a. Open Window 64): 1 core goal, 8 sub-goals, 64 actions
- Checking off actions fuels a rocket that evolves as your progress grows
- Hit 100% and watch the launch sequence play
- Guest mode: use it fully offline, no login required, data stays local

## How it works

Goal data (the grid, checkmarks, labels) lives in **localStorage**, isolated per user by key. Supabase is only used for **auth and profiles** (callsign, avatar) — none of your goal content touches the backend. Guest mode skips Supabase entirely and stores everything locally.

## Tech Stack

- React 18, TypeScript, Vite 5
- Tailwind CSS, shadcn/ui, framer-motion
- Supabase (Auth: Email + Google OAuth, `profiles` table with RLS)
- Deployed on Vercel

## Getting Started

### 1. Environment variables

Create a `.env.local` (do not commit it) **before running the app** — it won't boot without these, even in guest mode:

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key (safe to expose client-side; authorization is enforced by RLS, not by this key) |

### 2. Install and run

```sh
npm i
npm run dev
```

The dev server runs at **http://localhost:8080** (overridden in `vite.config`, not Vite's default 5173).

## Deployment

```sh
vercel --prod
```

Deploys are done via the Vercel CLI. **A `git push` alone does not trigger a deploy** — run `vercel --prod` explicitly.

---

# Orbit 81 (한국어)

오타니 쇼헤이가 고교 시절 썼던 것으로 유명한 만다라트 목표 설계법 — 우주 미션으로 재구성. 액션을 체크해 로켓에 연료를 채우고, 100%에 발사하세요.

**라이브**: https://orbit81.vercel.app

[English](#orbit-81) | 한국어

## 데모

_데모 이미지 준비 중입니다._

## 주요 기능

- 9×9 [만다라트](https://ko.wikipedia.org/wiki/%EB%A7%8C%EB%8B%A4%EB%9D%BC%ED%8A%B8) 그리드(오픈 윈도우 64): 핵심 목표 1개 + 서브 목표 8개 + 액션 64개
- 액션을 체크하면 로켓에 연료가 차고, 진행률에 따라 로켓이 진화
- 100% 달성 시 발사 시퀀스 재생
- 게스트 모드: 로그인 없이 완전 오프라인 사용, 데이터는 기기에만 저장

## 동작 방식

목표 데이터(그리드, 체크, 라벨)는 **localStorage**에 유저별 격리 키로 저장됩니다. Supabase는 **인증과 프로필**(콜사인, 아바타)에만 쓰이며, 목표 내용은 백엔드로 전송되지 않습니다. 게스트 모드는 Supabase를 아예 거치지 않고 전부 로컬에 저장합니다.

## 기술 스택

- React 18, TypeScript, Vite 5
- Tailwind CSS, shadcn/ui, framer-motion
- Supabase (인증: 이메일 + Google OAuth, `profiles` 테이블 + RLS)
- Vercel 배포

## 시작하기

### 1. 환경변수

**앱 실행 전에** `.env.local` 파일을 만드세요 (**커밋 금지**) — 게스트 모드라도 이 값이 없으면 앱이 뜨지 않습니다:

| 변수 | 설명 |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon 키 (클라이언트 노출 전제 키 — 실제 인가는 이 키가 아니라 RLS가 강제) |

### 2. 설치 및 실행

```sh
npm i
npm run dev
```

개발 서버는 **http://localhost:8080** 에서 실행됩니다 (`vite.config`에서 오버라이드 — Vite 기본값 5173이 아닙니다).

## 배포

```sh
vercel --prod
```

Vercel CLI로 배포합니다. **`git push`만으로는 배포되지 않습니다** — `vercel --prod`를 직접 실행해야 합니다.

---

Source is public for portfolio purposes. All rights reserved — not licensed for reuse.
소스는 포트폴리오 목적으로 공개돼 있습니다. 모든 권리 보유 — 재사용을 허가하지 않습니다.
