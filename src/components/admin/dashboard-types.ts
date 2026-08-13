export interface DashboardActivityPoint {
  date: string
  label: string
  messages: number
  communityMessages: number
  moods: number
  exercises: number
  crises: number
  signups: number
}

export interface DashboardCrisis {
  _id: string
  alertType: string
  severity: "mild" | "medium" | "severe"
  status: string
  source: string
  createdAt: string
  user: {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatar?: string | null
  } | null
}

export interface DashboardSignup {
  _id: string
  firstName: string
  lastName: string
  username: string
  email: string
  avatar?: string | null
  role: string
  isAccountVerified: boolean
  isDisabled: boolean
  createdAt: string
}

export interface DashboardAuditEntry {
  _id: string
  action: string
  actorRole: string
  createdAt: string
  actor: {
    _id: string
    username: string
    firstName: string
    lastName: string
    role: string
  } | null
  target: {
    _id: string
    username: string
    firstName: string
    lastName: string
    role: string
  } | null
}

export interface DashboardCommunity {
  _id: string
  name: string
  inviteKey: string
  category: string
  isPrivate: boolean
  createdAt: string
  memberCount: number
  messageCount: number
}

export interface AdminDashboardData {
  totals: {
    users: number
    therapists: number
    admins: number
    communities: number
    activeCrisis: number
    unverifiedUsers: number
    disabledUsers: number
    notifications: number
  }
  trends: {
    signupsToday: number
    signupsWeek: number
    signupsMonth: number
    communitiesWeek: number
    crisesWeek: number
    crisesMonth: number
    messagesWeek: number
    communityMessagesWeek: number
    moodsWeek: number
    exercisesWeek: number
  }
  activity: DashboardActivityPoint[]
  moodDistribution: { great: number; good: number; okay: number; bad: number; terrible: number }
  recentSignups: DashboardSignup[]
  activeCrises: DashboardCrisis[]
  recentAudit: DashboardAuditEntry[]
  topCommunities: DashboardCommunity[]
}
