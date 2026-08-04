# Therabridge Frontend

React 19 + TypeScript SPA for Therabridge, a mental wellness platform.

## Stack

- **React 19** + **TypeScript 6** (`strict`, `noUnusedLocals`)
- **Vite 8** — Build tool (with Tailwind CSS 4 plugin)
- **React Router 7** — Client routing
- **Zustand 5** — Global state (auth store with `persist`)
- **TanStack Query 5** — Data fetching hooks (therapists, notifications)
- **Axios** — HTTP client with auth interceptors
- **Socket.io-client** — real-time possible-screenshot notices (`lib/socket.ts`)
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
| `/signup` | Register | Redirects to `/signup/first-name` |
| `/signup/:step` | Register | One field per step (`first-name`, `last-name`, `username`, `email`, `date-of-birth`, `password`) |
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
│   ├── admin/              # Admin panel components (AdminStatCard, SearchBar, ...)
│   ├── crisis/             # Crisis support (AlertHistory, EmergencyContacts, ...)
│   ├── exercises/          # ExerciseCard, ExerciseModal, types
│   ├── home/               # ResourceCard, StreakCards, TherapistList, ...
│   ├── layout/             # AppLayout, SidebarNav, MobileDock, ScreenshotProtection, ...
│   ├── mood/               # MoodChart, MoodSelector, MoodHistory
│   ├── notifications/      # NotificationItem, NotificationsHeader
│   ├── privacy/            # GuardOverlay, WatermarkCanvas
│   ├── shared/             # Shared auth & profile components
│   │   ├── auth/           # ProtectedRoute, ErrorBoundary, LoginForm, SignupForm, ...
│   │   └── profile/        # ProfileHeader, ProfileInfoCard, PrivateFieldBadge
│   ├── therapist/          # Therapist dashboard components
│   ├── ui/                 # Shadcn/ui primitives
│   ├── user/
│   │   ├── chat/           # DM chat components
│   │   ├── community/      # Community group chat
│   │   ├── settings/       # Settings panels
│   │   ├── therapists/     # Therapist browsing
│   │   ├── therry/         # AI companion UI
│   │   └── shared/         # Shared user components (Avatar, MessageArea, ...)
│   └── shared/
├── hooks/                  # useScreenshotGuard
├── lib/                    # api, auth-api, query-client, query-hooks, sound, socket, utils
├── pages/
│   ├── admin/              # Dashboard, Users, Communities
│   ├── therapist/          # Dashboard, Clients
│   └── user/               # Home, Chat, Community, Mood, Settings, Profile, ...
├── store/auth-store.ts     # Zustand auth store
├── types/                  # Shared TypeScript types
├── assets/                 # ding.mp3 (notification sound)
├── App.tsx                 # Routes
└── main.tsx                # Entry (ThemeProvider, QueryClient, Toaster)
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
- **Privacy shield** — blur-on-blur, screenshot-attempt blackout, possible-screenshot notices, and watermarking. See the section below. These features raise the bar and leave a paper trail but **cannot prevent screenshots**.
- **Screenshot protection** (`components/layout/ScreenshotProtection.tsx`): blocks `PrintScreen`/`Cmd+Shift+S/3/4/5` and blurs the whole app when the tab loses focus.
- **Message sounds** (`lib/sound.ts`): plays `src/assets/ding.mp3` for new incoming DMs and community messages; volume lowers automatically in calm mode.
- **Join-only communities**: the create form was removed from the UI; users join via invite key.
- **Talking Points**: messaging is a wellness exercise — DMs/community messages earn +2 Wellness points, Therry chats earn +5 (capped 20/day). The Home streak cards show a "Talking Points today" meter. The earning mechanics are deliberately not explained in the UI so users discover them on their own.

## Privacy Shield

A set of features that discourage casual screenshots of sensitive views (chat DMs, community rooms) and keep an audit trail.

- **`useScreenshotGuard`** (`hooks/useScreenshotGuard.ts`) — a reusable hook for any sensitive view. In `"blur"` mode it blurs the container while the tab is unfocused; in `"blackout"` mode it shows a Snapchat-style black overlay that stays up briefly (default 250 ms) after the view becomes visible again. It also detects screenshot shortcuts (PrintScreen / `Cmd+Shift+S/3/4/5`) and calls `onSensitivityEvent`. Pair it with `<GuardOverlay />` (`components/privacy/GuardOverlay.tsx`) inside a `relative` container.
- **Possible-screenshot notices** — when a guard fires on a DM thread, the client emits `possible_screenshot` over Socket.io (see `lib/socket.ts`; falls back to `POST /api/chat/screenshot-notice` when disconnected). The server rate-limits to **1 per 10 s per user**, persists a `screenshot-notice` system message into the thread (both sides see it, it survives reloads), and pushes a real-time event to the peer's sockets.
- **Watermarking** — `components/privacy/WatermarkCanvas.tsx` tiles a low-opacity `username · timestamp` diagonal watermark across a view (client-side canvas). A server-side Sharp stamp (`POST /api/chat/watermark-stamp`) renders text to a PNG with a per-viewer watermark for flagged content.

**Honest limitation:** blur, blackout, notices, and watermarks deter casual copying and create a paper trail. They do **not** and cannot prevent screenshots — someone with another device, OS-level capture, or developer tools can still record content.

## Adding shadcn Components

```bash
npx shadcn@latest add button
```

Components are placed in `src/components/ui/` and importable as `@/components/ui/button`.
