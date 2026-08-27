# Therabridge Frontend

React 19 + TypeScript SPA for Therabridge, a mental wellness platform connecting users, therapists, and admins in a secure environment for mental health support.

**Production:** [therabridge.vercel.app](https://therabridge.vercel.app)

## Features

- **Direct Messaging** - Private DMs between users and therapists with privacy shields (blur, watermark, screenshot detection)
- **AI Wellness Companion** - "Therry" powered by Google Gemini for 24/7 mental health support
- **Community Chat** - Group rooms with invite-only access, moderation, and member management
- **Mood Tracking** - Daily mood logging with visual charts and statistics
- **Wellness Exercises** - Guided breathing, mindfulness, gratitude, grounding, and movement exercises
- **Crisis Alerts** - Real-time emergency notifications to therapists and admins
- **Therapist Management** - Client roster management, role-based access control
- **Gamification** - Exercise scores, login streaks, and talking points for engagement
- **Privacy Shield** - Screenshot protection, watermarking, and audit trails for sensitive content
- **Data Privacy & Compliance** - Persistent AI-disclosure modal, self-serve data export, account deletion, and retention notices
- **Live Crisis Escalation** - Therry auto-detects crisis language and surfaces an in-chat crisis card with region hotlines and one-tap therapist notification
- **Email Verification & Onboarding** - 6-digit code verification flow with resend cooldown, unverified banner, and a skippable two-step onboarding (avatar + bio)
- **Admin Analytics Dashboard** - KPI overview with 7/30-day trends and a 14-day activity line chart with toggleable legend series.

## Stack

- **React 19** + **TypeScript 6** (`strict`, `noUnusedLocals`)
- **Vite 8** - Build tool (with Tailwind CSS 4 plugin)
- **React Router 7** - Client routing
- **Zustand 5** - Global state (auth store with `persist`)
- **TanStack Query 5** - Data fetching hooks (therapists, notifications)
- **Axios** - HTTP client with auth interceptors
- **Socket.io-client** - real-time DMs, community messages, notifications, and possible-screenshot notices (`lib/socket.ts`)
- **Web Push (PWA)** - device notifications via a service worker (`public/sw.js`) + Push API (`lib/push.ts`); manifest at `public/manifest.webmanifest`
- **Tailwind CSS 4** - Utility-first styling (with `tw-animate-css`)
- **Radix UI** + **Shadcn/ui** - Headless primitives
- **Lucide React** - Icons
- **Sonner** - Toasts

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (proxy: `/api` → `http://localhost:5000`) |
| `npm run build` | `tsc -b && vite build` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint over the project |
| `npm run preview` | Preview the production build |

## Getting Started

### Prerequisites
- Node.js 18+
- The backend running on `http://localhost:5000` (see `../backend/README.md`)

### Setup

```bash
npm install
npm run dev      # Starts on http://localhost:5173 (Vite proxies /api → http://localhost:5000)
```

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
| `/verify-email` | Verify Email | 6-digit code entry (paste/auto-advance, resend with 60-s cooldown) |
| `/onboarding` | Onboarding | Post-verification profile setup (avatar + bio, both skippable) |
| `/` | Home/Dashboard | Greeting, streaks, exercises, appointments (admins see the analytics dashboard; therapists see their dashboard) |
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
| `/safety-plan` | Safety Plan | Crisis preparedness builder |
| `/clients` | Clients | Therapist panel |
| `/users` | Users | Admin panel |
| `/communities` | Communities | Admin panel |
| `/audit` | Audit Log | Admin panel (privacy audit trail) |
| `/user/:username` | Public Profile | View other users |
| `/therry` | - | Redirects to `/chat/therry` |
| `/404`, `*` | Not Found | Fallback page |

## Project Structure

```
src/
├── components/
│   ├── admin/              # Admin panel components (AdminStatCard, ActivityChart, dashboard-types, ...)
│   ├── crisis/             # Crisis support (AlertHistory, EmergencyContacts, ...)
│   ├── exercises/          # ExerciseCard, ExerciseModal, types
│   ├── home/               # ResourceCard, StreakCards, TherapistList, ...
│   ├── layout/             # AppLayout, SidebarNav, MobileDock, ScreenshotProtection, ...
│   ├── mood/               # MoodChart, MoodSelector, MoodHistory
│   ├── notifications/      # NotificationItem, NotificationsHeader
│   ├── privacy/            # GuardOverlay, WatermarkCanvas
│   ├── shared/             # Shared auth & profile components
│   │   ├── auth/           # ProtectedRoute, ErrorBoundary, LoginForm, SignupForm, VerifyEmailForm, useVerifyEmailState, ...
│   │   └── profile/        # ProfileHeader, ProfileInfoCard, PrivateFieldBadge
│   ├── therapist/          # Therapist dashboard components
│   ├── ui/                 # Shadcn/ui primitives
│   ├── user/
│   │   ├── chat/           # DM chat components
│   │   ├── community/      # Community group chat
│   │   ├── onboarding/     # OnboardingForm + useOnboardingState (avatar/bio setup)
│   │   ├── settings/       # Settings panels (incl. DataPrivacySection)
│   │   ├── therapists/     # Therapist browsing
│   │   ├── therry/         # AI companion UI (ChatMessage, SuggestionChips, ChatInput, AiDisclosureModal, CrisisActions, ...)
│   │   └── shared/         # Shared user components (Avatar, MessageArea, ...)
│   └── shared/
├── hooks/                  # useScreenshotGuard
├── lib/                    # api, auth-api, query-client, query-hooks, sound, socket, limits, utils
├── pages/
│   ├── admin/              # Dashboard, Users, Communities, AuditLog
│   ├── therapist/          # Dashboard, Clients
│   └── user/               # Home, Chat, Community, Mood, Settings, Profile, ...
├── store/auth-store.ts     # Zustand auth store
├── types/                  # Shared TypeScript types
├── assets/                 # ding.mp3 (notification sound)
├── App.tsx                 # Routes
└── main.tsx                # Entry (ThemeProvider, QueryClient, Toaster)
```

## State Management

- **Global**: `store/auth-store.ts` (Zustand + persist) - user, auth status, initialization.
- **Chat DMs**: `components/user/chat/useChatState.ts` + `useChatEffects.ts` - conversations, edit/unsend, message sounds. Opening a thread (or receiving a DM into an open thread) fires `PUT /api/chat/conversation/:userId/read` so unread badges settle; selecting a DM or Therry closes the mobile sidebar drawer. Incoming DMs arrive over Socket.io (`dm_message`, `dm_message_updated`, `dm_message_unsent`); the conversation list refreshes on `conversations_updated`.
- **Therry**: `components/user/chat/TherryChat.tsx` - loads history from `/api/therry/messages`, sends via `/api/therry/chat`, gates first use behind the AI-disclosure modal, and opens the crisis card when a reply is classified as a crisis.
- **Community**: `useCommunityState.ts` + `useCommunityEffects.ts` + `useMessagePolling.ts`. The client joins a Socket.io room per community (`join_community` / `leave_community`) and receives `community_message`, `community_message_updated`, `community_message_unsent` events.
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

- **Therry in chat** (`/chat/therry`): Gemini-powered (`gemini-3.5-flash`) wellness companion; every message is persisted server-side and replayed as history. Crisis keywords trigger a dedicated response with helpline info, an in-chat **crisis card** (`CrisisActions`) with region hotlines and a "Notify my therapist" button (`POST /api/crisis/message-therapist`), and a "Need help now" header pill that surfaces the same card on demand.
- **AI disclosure** (`AiDisclosureModal`): shown on first Therry visit until acknowledged (`POST /api/users/ai-disclosure`), persisted server-side and deduped per session via sessionStorage.
- **Data privacy** (Settings → Your Data): download a decrypted JSON export (`GET /api/users/export`) plus an encryption/retention explainer; account deletion stays in the Settings Danger Zone.
- **Privacy shield** - blur-on-blur, screenshot-attempt blackout, possible-screenshot notices, and watermarking. See the section below. These features raise the bar and leave a paper trail but **cannot prevent screenshots**.
- **Screenshot protection** (`components/layout/ScreenshotProtection.tsx`): blocks `PrintScreen`/`Cmd+Shift+S/3/4/5` and blurs the whole app when the tab loses focus.
- **Message sounds** (`lib/sound.ts`): plays `src/assets/ding.mp3` for new incoming DMs and community messages; volume lowers automatically in calm mode.
- **Join-only communities**: the create form was removed from the UI; users join via invite key.
- **Talking Points**: messaging is a wellness exercise - DMs/community messages earn +2 Wellness points, Therry chats earn +5 (capped 20/day). The Home streak cards show a "Talking Points today" meter. The earning mechanics are deliberately not explained in the UI so users discover them on their own.
- **Crisis severity** (`/crisis`): pick an alert type, rate severity (mild/moderate/severe), optionally request to be contacted, then send. The alert history shows severity + status chips, and alert type cards use neutral hints instead of baked-in severity labels. A `panic_attack` alert auto-launches `ExerciseModal` with a recommended grounding/breathing exercise as the first response.
- **Panic first-response in chat**: when Therry classifies a message as a `panic_attack`, it opens the crisis card and simultaneously launches `ExerciseModal` so the user gets the guided grounding/breathing exercise right away.
- **Safety plan** (`/safety-plan`): build a crisis safety plan across seven short sections (warning signs, coping, distraction people/settings, help people, professionals, means restriction, reasons for living) with add/remove items and live counters. Filled sections render **first** (before hotlines) in the Therry crisis card and the "Need help now" pill (`CrisisActions`). Linked from Settings, Crisis Support, and the user sidebar. Therapists view a client's plan read-only from the roster (`ClientProfilePanel` → `SafetyPlanModal`); every view is audit-logged.
- **Risk insights** (`/clients`): the therapist roster fetches `GET /api/therapist/clients/risk-summary` and shows a signal badge per client (low/medium/high) with an expandable "Signals to check in on" panel, reasons + mood/crisis/exercise/login snapshot, framed with a "not a diagnosis" disclaimer.
- **Proactive Therry check-in**: when 3 consecutive mood entries drop below the user's baseline, the backend sends a `mood_checkin` notification (pink heart icon in the notifications center, deep-links to `/chat/therry`) and persists a Therry message that appears in chat history.
- **Signup date of birth**: the `date-of-birth` step uses three selects (day/month/year), the day list is leap/month-aware and the year range enforces the 18–120 rule, replacing the calendar popover.
- **Input limits & counters**: every free-text field (messages, Therry chats, mood notes, crisis descriptions, bio, community fields) is capped from a single shared constant `src/lib/limits.ts`, the backend re-validates with the same caps, so the client limit is a hard stop (typing is sliced) with a live `CharCounter` (`components/ui/char-counter.tsx`, amber near 80%, red over). Keep `limits.ts` in sync with `backend/utils/validation.js` and the Mongoose validators.
- **Email verification** (`/verify-email`): six single-digit code boxes with paste support (fills all six) and auto-advance; inline errors for expired/incorrect codes; a "Resend code" action with a 60-second countdown matching the server's `resendCooldownSeconds`; an "already verified" screen when the account is already `isAccountVerified`. The app shell shows an amber `MailCheck` banner for unverified users.
- **Onboarding** (`/onboarding`): reached right after verifying, step 0 uploads an avatar or skips, step 1 writes a 300-char bio or skips. Purely client-driven (reuses `uploadAvatar` / `updateProfile`), so both steps can be skipped safely.
- **Admin analytics dashboard**: admins land on the dashboard at `/`. `DashboardPage` fetches `GET /api/admin/dashboard` and renders KPI stat cards, 7/30-day trend chips, mood distribution, and recent signups / active crises / top communities / audit feeds with a manual refresh. The `ActivityChart` is a custom SVG line chart (no chart library) over the 14-day activity series, six metrics with hover crosshair + tooltip, and **clickable legend pills that toggle each line** (the y-axis rescales and the tooltip drops hidden series; hiding everything shows an "All series are hidden" state).

## Real-time Updates (Socket.io)

The frontend uses Socket.io instead of long-polling for live data. The socket connects once on login/initialize (`store/auth-store.ts`) and reconnects automatically; it disconnects on logout/session expiry.

**Server → client events** (authenticated via JWT, delivered to `user:<id>` rooms):

| Event | Payload | Effect |
|-------|---------|--------|
| `dm_message` | populated message | merge into open conversation, play sound if incoming |
| `dm_message_updated` / `dm_message_unsent` | message / `{ messageId }` | update the message in place |
| `conversations_updated` | `{ partnerId }` | refresh conversation list + unread badge |
| `community_message` | `{ communityId, message }` | merge into open community room, play sound |
| `community_message_updated` / `community_message_unsent` | `{ communityId, message }` | update the message in place |
| `notification` | notification doc | refresh notification count |

**Client → server events:**

| Event | Payload | Purpose |
|-------|---------|---------|
| `join_community` / `leave_community` | `{ communityId }` | join/leave the room for a community being viewed (re-joined automatically on reconnect) |
| `possible_screenshot` | `{ conversationId }` | possible-screenshot notice (falls back to `POST /api/chat/screenshot-notice` when disconnected) |

The REST long-poll endpoints (`/api/chat/conversation/:id/updates`, `/api/chat/communities/:id/updates`) are kept server-side for backwards compatibility but are no longer used by the client.

## Device Notifications (Web Push)

Beyond the in-app notification center, the app can alert you on the device itself (desktop browsers, Android Chrome, iOS Safari 16.4+) via Web Push.

- **Enabling:** Settings → Notifications → **Device notifications**. The toggle registers `public/sw.js`, requests browser permission, fetches the public VAPID key from `GET /api/push/vapid-public-key`, subscribes, and stores it via `POST /api/push/subscribe`.
- **Sync:** after login/register/initialize, `syncPushSubscription()` re-wires an already-granted permission without prompting (never nags returning users). On logout/session expiry the device is unsubscribed and the service worker is unregistered.
- **Receiving:** `public/sw.js` shows the push notification and, on tap, opens/navigates to the event's deep link (chat thread, community, crisis, mood, …). Payload: `{ title, body, data: { url, type, notificationId } }`.
- **What triggers it:** DMs, community messages, crisis alerts, exercise/streak milestones, mood reminders, and community invites - the same events as the in-app notification center. Chat pushes are skipped while you're actively online (Socket.io delivers in-app instead).

## Privacy Shield

A set of features that discourage casual screenshots of sensitive views (chat DMs, community rooms) and keep an audit trail.

- **`useScreenshotGuard`** (`hooks/useScreenshotGuard.ts`) - a reusable hook for any sensitive view. In `"blur"` mode it blurs the container while the tab is unfocused; in `"blackout"` mode it shows a Snapchat-style black overlay that stays up briefly (default 250 ms) after the view becomes visible again. It also detects screenshot shortcuts (PrintScreen / `Cmd+Shift+S/3/4/5`) and calls `onSensitivityEvent`. Pair it with `<GuardOverlay />` (`components/privacy/GuardOverlay.tsx`) inside a `relative` container.
- **Possible-screenshot notices** - when a guard fires on a DM thread, the client emits `possible_screenshot` over Socket.io (see `lib/socket.ts`; falls back to `POST /api/chat/screenshot-notice` when disconnected). The server rate-limits to **1 per 10 s per user**, persists a `screenshot-notice` system message into the thread (both sides see it, it survives reloads), and pushes a real-time event to the peer's sockets.
- **Watermarking** - `components/privacy/WatermarkCanvas.tsx` tiles a low-opacity `username · timestamp` diagonal watermark across a view (client-side canvas). A server-side Sharp stamp (`POST /api/chat/watermark-stamp`) renders text to a PNG with a per-viewer watermark for flagged content.

**Honest limitation:** blur, blackout, notices, and watermarks deter casual copying and create a paper trail. They do **not** and cannot prevent screenshots - someone with another device, OS-level capture, or developer tools can still record content.

## Adding shadcn Components

```bash
npx shadcn@latest add button
```

Components are placed in `src/components/ui/` and importable as `@/components/ui/button`.
