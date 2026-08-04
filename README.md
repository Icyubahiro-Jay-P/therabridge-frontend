# Therabridge Frontend

React 19 + TypeScript SPA for Therabridge, a mental wellness platform.

## Stack

- **React 19** + **TypeScript 6** (`strict`, `noUnusedLocals`)
- **Vite 8** — Build tool (with Tailwind CSS 4 plugin)
- **React Router 7** — Client routing
- **Zustand 5** — Global state (auth store with `persist`)
- **TanStack Query 5** — Data fetching hooks (therapists, notifications)
- **Axios** — HTTP client with auth interceptors
- **Tailwind CSS 4** — Utility-first styling (with `tw-animate-css`)
- **Radix UI** + **Shadcn/ui** — Headless primitives
- **Lucide React** — Icons
- **Sonner** — Toasts

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (proxy: `/api` → `http://localhost:5000`) |
| `npm run build` | `tsc -b && vite build` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint over the project |
| `npm run preview` | Preview the production build |

## Environment

`.env` intentionally has no values. In dev, Vite proxies `/api` to the backend (see `vite.config.ts`). In production, set `VITE_API_URL` (or use `vercel.json` rewrites) to point `/api/*` at the backend.

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Email/username + password |
| `/signup` | Register | Full registration form |
| `/forgot-password` | Forgot Password | Email reset request |
| `/reset-password/:token` | Reset Password | New password form |
| `/` | Home/Dashboard | Greeting, streaks, exercises, appointments |
| `/chat` | Chat | Direct-message hub (conversation list) |
| `/chat/:username` | Chat | DM thread with another user |
| `/chat/therry` | Therry | AI wellness companion (history persisted) |
| `/community` | Communities | Group chat rooms (join by invite key) |
| `/community/:inviteKey` | Community | Prefilled join flow |
| `/mood` | Mood Tracker | Log & visualize moods |
| `/therapists` | Browse Therapists | Find & connect |
| `/settings` | Settings | Chat, privacy, appearance, sound, focus |
| `/profile` | My Profile | Edit personal info |
| `/notifications` | Notifications | Read/manage alerts |
| `/crisis` | Crisis Support | Emergency alert system |
| `/clients` | Clients | Therapist panel |
| `/users` | Users | Admin panel |
| `/communities` | Communities | Admin panel |
| `/user/:username` | Public Profile | View other users |
| `/therry` | — | Redirects to `/chat/therry` |
| `/404`, `*` | Not Found | Fallback page |

## Project Structure

```
src/
├── components/
│   ├── auth/            # ProtectedRoute, ErrorBoundary
│   ├── exercises/       # ExerciseCard, ExerciseModal, types
│   ├── layout/          # AppLayout, SidebarNav, MobileDock, ScreenshotProtection, ...
│   └── ui/              # Shadcn/ui primitives
├── lib/                 # api, auth-api, query-client, query-hooks, sound, utils
├── pages/
│   ├── user/            # User pages (chat, community, mood, settings, profile, ...)
│   ├── admin/           # Dashboard, Users, Communities
│   ├── therapist/       # Dashboard, Clients
│   ├── components/      # Shared auth & profile components
│   └── ...              # Login, Signup, Forgot/Reset, PublicProfile, NotFound
├── store/auth-store.ts  # Zustand auth store
├── types/               # Shared types
├── assets/              # ding.mp3 (notification sound)
├── App.tsx              # Routes
└── main.tsx             # Entry (ThemeProvider, QueryClient, Toaster)
```

## State Management

- **Global**: `store/auth-store.ts` (Zustand + persist) — user, auth status, initialization.
- **Chat DMs**: `pages/user/components/chat/useChatState.ts` + `useChatEffects.ts` — conversations, polling with `useMessagePolling`-style updates, edit/unsend, message sounds.
- **Therry**: `pages/user/components/chat/TherryChat.tsx` — loads history from `/api/therry/messages`, sends via `/api/therry/chat`.
- **Community**: `useCommunityState.ts` + `useCommunityEffects.ts` + `useMessagePolling.ts`.
- **Home / Mood / Settings / Profile**: `useHomeState.ts`, `useMoodState.ts`, `useSettingsState.ts`, `useProfileState.ts`.
- **Server state**: `lib/query-hooks.ts` (therapists, notifications) via TanStack Query.

## Client-side Settings

Stored in `localStorage` under key `therabridge-settings` (managed by `useSettingsState.ts`):

| Key | Default | Description |
|-----|---------|-------------|
| `messagePreviews` | `true` | Show message previews in chat list |
| `enterToSend` | `true` | Enter sends (Shift+Enter = newline) |
| `readReceipts` | `true` | Read receipts (server: `User.chatSettings`) |
| `fontSize` | `normal` | `normal` \| `large` |
| `calmMode` | `false` | Green low-contrast theme (`html.calm-mode`) |
| `soundEnabled` | `true` | Play sounds for incoming messages |
| `soundVolume` | `70` | Volume % (0–100) |
| `screenshotProtection` | `false` | Block screenshot shortcuts + blur on unfocus |
| `watermarkEnabled` | `false` | Overlay tiled username/timestamp watermark on chats |
| `accountVisibility` | `visible` | `visible` \| `anonymous` |
| `focusMode` | `false` | Hide distracting UI |

## Key Features

- **Therry in chat** (`/chat/therry`): Gemini-powered (`gemini-3.5-flash`) wellness companion; every message is persisted server-side and replayed as history. Crisis keywords trigger a dedicated response with helpline info.
- **Screenshot protection** (`components/layout/ScreenshotProtection.tsx`): blocks `PrintScreen`/`Cmd+Shift+S/3/4/5` and blurs the whole app when the tab loses focus.
- **Message sounds** (`lib/sound.ts`): plays `src/assets/ding.mp3` for new incoming DMs and community messages; volume lowers automatically in calm mode.
- **Join-only communities**: the create form was removed from the UI; users join via invite key.
- **Talking Points**: messaging is a wellness exercise — DMs/community messages earn +2 Wellness points, Therry chats earn +5 (capped 20/day). The Home streak cards show a "Talking Points today" meter. The earning mechanics are deliberately not explained in the UI so users discover them on their own.

## Adding shadcn Components

```bash
npx shadcn@latest add button
```

Components are placed in `src/components/ui/` and importable as `@/components/ui/button`.
