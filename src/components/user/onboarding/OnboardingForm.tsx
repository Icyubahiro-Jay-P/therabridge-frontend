import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  TriangleAlert,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useOnboardingState } from "./useOnboardingState"

const MAX_BIO_LENGTH = 300

export function OnboardingForm() {
  const {
    user,
    isLoading,
    step,
    fileInputRef,
    avatarFile,
    avatarPreview,
    avatarUrl,
    avatarUploading,
    avatarError,
    bio,
    bioSaving,
    bioError,
    handleAvatarChange,
    handleRemoveSelected,
    handleAvatarSave,
    handleBioSave,
    next,
    finish,
    setBio,
  } = useOnboardingState()

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
        .trim()
        .toUpperCase() || "@"
    : "@"

  const previewSrc = avatarPreview || avatarUrl

  function skipStep() {
    if (step === 0) next()
    else finish()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === step
                ? "w-8 bg-emerald-500"
                : i < step
                  ? "w-4 bg-emerald-300 dark:bg-emerald-600"
                  : "w-4 bg-gray-200 dark:bg-gray-700"
            )}
          />
        ))}
      </div>

      {step === 0 ? (
        <section aria-labelledby="onboarding-avatar-title" className="space-y-5">
          <div className="text-center">
            <h2
              id="onboarding-avatar-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Add a profile picture
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Optional — a photo helps friends and therapists recognise you.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="size-28 border-4 border-white shadow-lg dark:border-gray-800">
                {previewSrc ? <AvatarImage src={previewSrc} /> : null}
                <AvatarFallback className="bg-emerald-100 text-2xl font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveSelected}
                  aria-label="Remove selected photo"
                  className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                variant="outline"
                className="cursor-pointer"
              >
                <Camera className="size-4" />
                {avatarFile ? "Choose a different photo" : "Choose a photo"}
              </Button>
              {avatarFile && (
                <Button
                  type="button"
                  onClick={() => void handleAvatarSave()}
                  disabled={avatarUploading}
                  className="w-full bg-linear-to-r from-emerald-600 to-teal-600 font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 sm:w-auto"
                >
                  {avatarUploading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Check className="size-4" />
                      Save and continue
                    </>
                  )}
                </Button>
              )}
            </div>

            {avatarError && (
              <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                {avatarError}
              </p>
            )}
          </div>
        </section>
      ) : (
        <section aria-labelledby="onboarding-bio-title" className="space-y-5">
          <div className="text-center">
            <h2
              id="onboarding-bio-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Tell us a little about yourself
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Optional — a short bio appears on your public profile.
            </p>
          </div>

          <div className="space-y-2">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={MAX_BIO_LENGTH}
              rows={4}
              placeholder="e.g. I'm here to build healthier habits and find calm one day at a time."
              className="w-full resize-none rounded-2xl border border-input bg-input/30 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-emerald-500 focus-visible:ring-[3px] focus-visible:ring-emerald-500/40 dark:text-white"
            />
            <p className="text-right text-xs text-gray-400 dark:text-gray-500">
              {bio.length}/{MAX_BIO_LENGTH}
            </p>
            {bioError && (
              <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                {bioError}
              </p>
            )}
          </div>

          <Button
            type="button"
            onClick={() => void handleBioSave()}
            disabled={bioSaving || isLoading}
            className="w-full bg-linear-to-r from-emerald-600 to-teal-600 font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
          >
            {bioSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <ImagePlus className="size-4" />
                Save and continue
              </>
            )}
          </Button>
        </section>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={skipStep}
          disabled={avatarUploading || bioSaving}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-gray-400 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Skip for now
        </button>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          You can change these anytime from your profile.
        </p>
      </div>
    </div>
  )
}
