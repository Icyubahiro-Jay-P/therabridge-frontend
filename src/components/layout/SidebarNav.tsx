import {
  Home, LayoutDashboard, MessageCircle, Users, Heart,
  Stethoscope, User, Shield, ShieldCheck, AlertTriangle, Bell, Settings, Brain, ClipboardCheck, Sparkles, Calendar, Route, BookOpen,
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
  const homeIcon = role === "user" ? <Home className="size-4" /> : <LayoutDashboard className="size-4" />
  const homeLabel = role === "user" ? "Home" : "Dashboard"

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      <NavItem to="/" icon={homeIcon} label={homeLabel} minimized={isMinimized} end onClick={closeMobile} />
      <NavItemWithBadge to="/chat" icon={<MessageCircle className="size-4" />} label="Chat" minimized={isMinimized} badge={unreadCount} onClick={closeMobile} />
      <NavItem to="/community" icon={<Users className="size-4" />} label="Community" minimized={isMinimized} onClick={closeMobile} />
      {role === "user" && (
        <>
          <NavItem to="/mood" icon={<Heart className="size-4" />} label="Mood" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/thought-records" icon={<Brain className="size-4" />} label="Thought Records" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/assessments" icon={<ClipboardCheck className="size-4" />} label="Assessments" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/gratitude" icon={<Sparkles className="size-4" />} label="Gratitude" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/activities" icon={<Calendar className="size-4" />} label="Activities" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/learn" icon={<BookOpen className="size-4" />} label="Learn" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/programs" icon={<Route className="size-4" />} label="Programs" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/coping-cards" icon={<Layers className="size-4" />} label="Coping Cards" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/therapists" icon={<Stethoscope className="size-4" />} label="Therapists" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/safety-plan" icon={<ShieldCheck className="size-4" />} label="Safety Plan" minimized={isMinimized} onClick={closeMobile} />
        </>
      )}
      {role === "therapist" && (
        <NavItem to="/clients" icon={<User className="size-4" />} label="Clients" minimized={isMinimized} onClick={closeMobile} />
      )}
      {role === "admin" && (
        <>
          <NavItem to="/users" icon={<User className="size-4" />} label="Users" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/communities" icon={<Shield className="size-4" />} label="Communities" minimized={isMinimized} onClick={closeMobile} />
          <NavItem to="/audit" icon={<ShieldCheck className="size-4" />} label="Audit log" minimized={isMinimized} onClick={closeMobile} />
        </>
      )}
      <div className="mt-auto" />
      <NavItem to="/crisis" icon={<AlertTriangle className="size-4" />} label="Crisis Support" minimized={isMinimized} onClick={closeMobile} />
      <NavItemWithBadge to="/notifications" icon={<Bell className="size-4" />} label="Notifications" minimized={isMinimized} badge={notificationCount} onClick={closeMobile} />
      <NavItem to="/settings" icon={<Settings className="size-4" />} label="Settings" minimized={isMinimized} onClick={closeMobile} />
      <NavItem to="/profile" icon={<User className="size-4" />} label="Profile" minimized={isMinimized} onClick={closeMobile} />
    </nav>
  )
}
