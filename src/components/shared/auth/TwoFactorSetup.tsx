import { useState, useEffect } from "react"
import { Loader2, ShieldCheck, ShieldOff, Copy, Check, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import {
  setupTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
  getTwoFactorStatus,
  type TwoFactorSetupResponse,
} from "@/lib/auth-api"

type Phase = "idle" | "setup" | "verify" | "enabled" | "disable"

export function TwoFactorSetup() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const [phase, setPhase] = useState<Phase>("idle")
  const [setupData, setSetupData] = useState<TwoFactorSetupResponse | null>(null)
  const [code, setCode] = useState("")
  const [disablePassword, setDisablePassword] = useState("")
  const [disableCode, setDisableCode] = useState("")
  const [showDisablePassword, setShowDisablePassword] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEnabled = user?.twoFactorEnabled

  useEffect(() => {
    if (!isEnabled && phase === "idle") {
      getTwoFactorStatus()
        .then((s) => {
          if (s.enabled) {
            setPhase("enabled")
            if (setUser && user) setUser({ ...user, twoFactorEnabled: true })
          }
        })
        .catch(() => {})
    }
  }, [isEnabled, phase, setUser, user])

  async function handleStartSetup() {
    setLoading(true)
    setError("")
    try {
      const data = await setupTwoFactor()
      if ("alreadyEnabled" in data && data.alreadyEnabled) {
        // Already protected is the goal state - show it as success, not error.
        if (setUser && user) setUser({ ...user, twoFactorEnabled: true })
        setPhase("enabled")
        return
      }
      setSetupData(data)
      setPhase("setup")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start setup")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifySetup() {
    if (code.length !== 6) return
    setLoading(true)
    setError("")
    try {
      const result = await verifyTwoFactorSetup(code)
      if ("alreadyEnabled" in result && result.alreadyEnabled) {
        if (setUser && user) setUser({ ...user, twoFactorEnabled: true })
        setPhase("enabled")
        return
      }
      setBackupCodes(result.backupCodes)
      setPhase("verify")
      if (setUser && user) setUser({ ...user, twoFactorEnabled: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code")
    } finally {
      setLoading(false)
    }
  }

  async function handleDisable() {
    if (!disablePassword || disableCode.length !== 6) return
    setLoading(true)
    setError("")
    try {
      await disableTwoFactor(disablePassword, disableCode)
      setPhase("idle")
      setDisablePassword("")
      setDisableCode("")
      if (setUser && user) setUser({ ...user, twoFactorEnabled: false })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable 2FA")
    } finally {
      setLoading(false)
    }
  }

  function copyBackupCodes() {
    navigator.clipboard.writeText(backupCodes.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (phase === "verify") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Two-Factor Authentication Enabled
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Save these backup codes in a safe place
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
          Each backup code can only be used once. Store them securely — you&apos;ll need
          them if you lose access to your authenticator app.
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Backup Codes
            </span>
            <button
              onClick={copyBackupCodes}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {backupCodes.map((c) => (
              <code
                key={c}
                className="rounded bg-white px-2 py-1 text-center font-mono text-xs text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                {c}
              </code>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setPhase("enabled")}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          Done
        </Button>
      </div>
    )
  }

  if (phase === "enabled") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Two-Factor Authentication is Enabled
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your account is protected with an authenticator app
            </p>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Disable Two-Factor Authentication
          </p>
          <div>
            <label htmlFor="disable-pw" className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
              Current password
            </label>
            <div className="relative">
              <input
                id="disable-pw"
                type={showDisablePassword ? "text" : "password"}
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-input/30 px-3 pr-9 text-sm outline-none focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:text-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowDisablePassword(!showDisablePassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showDisablePassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="disable-code" className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
              TOTP code
            </label>
            <input
              id="disable-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
              className="h-9 w-full rounded-lg border border-input bg-input/30 px-3 text-center font-mono text-sm tracking-widest outline-none focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:text-white"
              placeholder="000000"
            />
          </div>
          <Button
            onClick={handleDisable}
            disabled={!disablePassword || disableCode.length !== 6 || loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldOff className="size-4" />}
            Disable 2FA
          </Button>
        </div>
      </div>
    )
  }

  if (phase === "setup" && setupData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Set Up Two-Factor Authentication
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Scan the QR code with your authenticator app
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={setupData.qrCode}
            alt="2FA QR Code"
            className="size-48 rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
          <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            Or enter this secret manually:
          </p>
          <code className="break-all font-mono text-xs text-gray-800 dark:text-gray-200">
            {setupData.secret}
          </code>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="totp-verify" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Enter the 6-digit code from your app
          </label>
          <input
            id="totp-verify"
            type="text"
            inputMode="numeric"
            maxLength={6}
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="h-11 w-full rounded-lg border border-input bg-input/30 px-3 text-center font-mono text-lg tracking-[0.3em] outline-none focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:text-white"
            placeholder="000000"
          />
        </div>

        <Button
          onClick={handleVerifySetup}
          disabled={code.length !== 6 || loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          Verify & Enable
        </Button>

        <button
          type="button"
          onClick={() => {
            setPhase("idle")
            setSetupData(null)
            setCode("")
            setError("")
          }}
          className="w-full text-center text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <ShieldCheck className="size-4 text-gray-400 dark:text-gray-500" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Two-Factor Authentication
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Add an extra layer of security to your account
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        When enabled, you&apos;ll need to enter a code from your authenticator app each
        time you sign in.
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      )}

      <Button
        onClick={handleStartSetup}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
        Enable Two-Factor Authentication
      </Button>
    </div>
  )
}
