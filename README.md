# Therabridge — Frontend

React 19 + TypeScript SPA for Therabridge, a mental wellness platform.

## Stack

- **React 19** + **TypeScript 6**
- **Vite 8** — Build tool
- **React Router 7** — Client routing
- **Zustand 5** — State management (auth, global)
- **Axios** — HTTP client with interceptors
- **Tailwind CSS 4** — Utility-first styling
- **Radix UI** + **Shadcn/ui** — Headless primitives
- **Lucide React** — Icons

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Email/username + password |
| `/signup` | Register | Full registration form |
| `/forgot-password` | Forgot Password | Email reset request |
| `/reset-password/:token` | Reset Password | New password form |
| `/` | Home/Dashboard | Streaks, exercises, appointments |
| `/chat` | Direct Messages | One-on-one messaging |
| `/community` | Communities | Group chat rooms |
| `/mood` | Mood Tracker | Log & visualize moods |
| `/therry` | AI Companion | Rule-based therapeutic chat |
| `/therapists` | Browse Therapists | Find & connect |
| `/settings` | Settings | Account, privacy, chat prefs |
| `/profile` | My Profile | Edit personal info |
| `/notifications` | Notifications | Read/manage alerts |
| `/crisis` | Crisis Support | Emergency alert system |
| `/user/:username` | Public Profile | View other users |

## State Management

- **Global**: `auth-store` (Zustand + persist) handles user, auth state, chat/privacy settings
- **Chat DM**: Custom `useChatState` + `useChatEffects` hooks
- **Community**: Custom `useCommunityState` + `useCommunityEffects` + `useMessagePolling`

## Adding shadcn Components

```bash
npx shadcn@latest add button
```

Components are placed in `src/components/ui/` and importable as `@/components/ui/button`.
