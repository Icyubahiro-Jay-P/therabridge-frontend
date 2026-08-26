import {
  Home, LayoutDashboard, MessageCircle, Users, Heart,
  Stethoscope, User, Shield, ShieldCheck, AlertTriangle, Bell, Settings, Brain, ClipboardCheck, Sparkles, Calendar, Route, BookOpen, Moon, Pill, Bird, Layers, NotebookPen, Repeat,
} from "lucide-react"
import { NavItem, NavItemWithBadge } from "./NavItem"

export function SidebarNav({
  isMinimized, closeMobile, unreadCount, notificationCount, role,
}: {
  isMinimized: boolean
  closeMobile: () => void
  unreadCount: number
  notificationCount: number
  role: string
}) {
  const iconSize = isMinimized ? "size-5" : "size-4"
  const homeIcon = role === "user" ? <Home className={iconSize} /> : <LayoutDashboard className={iconSize} />
  const homeLabel = role === "user" ? "Home" : "Dashboard"

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
      <div data-onboarding-id="home-dashboard">
        <NavItem to="/" icon={homeIcon} label={homeLabel} minimized={isMinimized} end onClick={closeMobile} />
      </div>
      <div data-onboarding-id="chat-nav">
        <NavItemWithBadge to="/chat" icon={<MessageCircle className={iconSize} />} label="Chat" minimized={isMinimized} badge={unreadCount} onClick={closeMobile} />
      </div>
      <div data-onboarding-id="community-nav">
        <NavItem to="/community" icon={<Users className={iconSize} />} label="Community" minimized={isMinimized} onClick={closeMobile} />
      </div>
      <div data-onboarding-id="mood-nav">
        <NavItem to="/mood" icon={<Heart className={iconSize} />} label="Mood" minimized={isMinimized} onClick={closeMobile} />
      </div>
      <NavItem to="/journal" icon={<NotebookPen className={iconSize} />} label="Journal" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/habits" icon={<Repeat className={iconSize} />} label="Habits" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/thought-records" icon={<Brain className={iconSize} />} label="Thought Records" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/assessments" icon={<ClipboardCheck className={iconSize} />} label="Assessments" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/gratitude" icon={<Sparkles className={iconSize} />} label="Gratitude" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/activities" icon={<Calendar className={iconSize} />} label="Activities" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/learn" icon={<BookOpen className={iconSize} />} label="Learn" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/sleep" icon={<Moon className={iconSize} />} label="Sleep" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/medications" icon={<Pill className={iconSize} />} label="Medications" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/pet" icon={<Bird className={iconSize} />} label="Companion" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/programs" icon={<Route className={iconSize} />} label="Programs" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/coping-cards" icon={<Layers className={iconSize} />} label="Coping Cards" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/safety-plan" icon={<ShieldCheck className={iconSize} />} label="Safety Plan" minimized={isMinimized} onClick={closeMobile} />
      {(role === "user" || role === "therapist") && (
        <NavItem to="/therapists" icon={<Stethoscope className={iconSize} />} label="Therapists" minimized={isMinimized} onClick={closeMobile} />
      )}
      {role === "therapist" && (
        <NavItem to="/clients" icon={<User className={iconSize} />} label="Clients" minimized={isMinimized} onClick={closeMobile} />
      )}
      {role === "admin" && (
        <>
          <NavItem to="/users" icon={<User className={iconSize} />} label="Users" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/communities" icon={<Shield className={iconSize} />} label="Communities" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/audit" icon={<ShieldCheck className={iconSize} />} label="Audit log" minimized={isMinimized} onClick={closeMobile} />
        </>
      )}
      <div className="mt-auto" />
      <div data-onboarding-id="crisis-nav">
        <NavItem to="/crisis" icon={<AlertTriangle className={iconSize} />} label="Crisis Support" minimized={isMinimized} onClick={closeMobile} />
      </div>
      <NavItemWithBadge to="/notifications" icon={<Bell className={iconSize} />} label="Notifications" minimized={isMinimized} badge={notificationCount} onClick={closeMobile} />
      <NavItem to="/settings" icon={<Settings className={iconSize} />} label="Settings" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/profile" icon={<User className={iconSize} />} label="Profile" minimized={isMinimized} onClick={closeMobile} />
    </nav>
  )
}
