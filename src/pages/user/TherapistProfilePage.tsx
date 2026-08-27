import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Globe2,
  MessageCircle,
  Star,
  Stethoscope,
  TriangleAlert,
  User as UserIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/store/auth-store"
import {
  useTherapistProfile,
  useTherapistReviews,
  useCreateReview,
} from "@/lib/query-hooks"
import { getErrorMessage } from "@/lib/errors"
import { LIMITS } from "@/lib/limits"
import { BookSessionModal } from "@/components/user/therapists/BookSessionModal"
import { Stars } from "@/components/user/therapists/Stars"

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

export function TherapistProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.user)

  const { data: therapist, isLoading, isError } = useTherapistProfile(username)
  const { data: reviewsData } = useTherapistReviews(therapist?._id ?? therapist?.id)

  const [bookingOpen, setBookingOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewContent, setReviewContent] = useState("")
  const [reviewError, setReviewError] = useState<string | null>(null)
  const createReview = useCreateReview()

  const therapistId = therapist?._id ?? therapist?.id

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (isError || !therapist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <TriangleAlert className="size-10 text-amber-500" />
        <p className="text-gray-600 dark:text-gray-300">Therapist not found.</p>
        <Button variant="outline" onClick={() => navigate("/therapists")}>
          Back to therapists
        </Button>
      </div>
    )
  }

  const reviews = reviewsData?.data ?? []
  const canReview = currentUser?.role === "user"

  async function handleSubmitReview() {
    if (!therapistId) return
    if (reviewContent.trim().length === 0) {
      setReviewError("Please write a few words about your experience.")
      return
    }
    setReviewError(null)
    try {
      await createReview.mutateAsync({
        therapistId,
        rating: reviewRating,
        title: reviewTitle.trim() || undefined,
        content: reviewContent.trim(),
      })
      setReviewTitle("")
      setReviewContent("")
      setReviewRating(5)
    } catch (err) {
      setReviewError(getErrorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <button
        onClick={() => navigate("/therapists")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 dark:text-gray-400"
      >
        <ArrowLeft className="size-4" /> All therapists
      </button>

      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <Stethoscope className="size-8" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {therapist.firstName} {therapist.lastName}
              </h1>
              {therapist.credentials && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {therapist.credentials}
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Briefcase className="size-3.5" />
                {therapist.yearsExperience ? `${therapist.yearsExperience} yrs experience` : "Therapist"}
              </span>
              {therapist.languages?.length ? (
                <span className="flex items-center gap-1">
                  <Globe2 className="size-3.5" />
                  {therapist.languages.join(", ")}
                </span>
              ) : null}
              {therapist.sessionPrice != null && therapist.sessionPrice > 0 && (
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  ${therapist.sessionPrice} / session
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Stars rating={therapist.rating ?? 0} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {therapist.reviewCount > 0
                  ? `${therapist.reviewCount} ${therapist.reviewCount === 1 ? "review" : "reviews"}`
                  : "No reviews yet"}
              </span>
            </div>

            {therapist.specialization?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {therapist.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <Button
              variant="outline"
              onClick={() => navigate(`/chat/${therapist.username}`)}
              className="w-full sm:w-auto"
            >
              <MessageCircle className="size-4" /> Message
            </Button>
            <Button
              onClick={() => setBookingOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
            >
              <CalendarDays className="size-4" /> Book a session
            </Button>
          </div>
        </div>

        {therapist.bio ? (
          <p className="mt-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {therapist.bio}
          </p>
        ) : null}
      </div>

      {/* Reviews */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            No reviews yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-5">
            {reviews.map((review) => (
              <li key={review._id} className="border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    <UserIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {review.reviewer?.firstName} {review.reviewer?.lastName}
                      </span>
                      <Stars rating={review.rating} />
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                {review.title && (
                  <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {review.title}
                  </p>
                )}
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {review.content}
                </p>
              </li>
            ))}
          </ul>
        )}

        {canReview && therapistId && (
          <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Leave a review
            </h3>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setReviewRating(n)}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                >
                  <Star
                    className={`size-6 ${n <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
                  />
                </button>
              ))}
            </div>
            <input
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              maxLength={LIMITS.review.title}
              placeholder="Summary (optional)"
              className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              maxLength={LIMITS.review.content}
              placeholder="What was your experience like?"
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <div className="mt-1 text-right text-xs text-gray-400">
              {reviewContent.length}/{LIMITS.review.content}
            </div>
            {reviewError && (
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <TriangleAlert className="size-4 shrink-0" />
                {reviewError}
              </div>
            )}
            <Button
              onClick={handleSubmitReview}
              disabled={createReview.isPending}
              className="mt-3 bg-emerald-600 hover:bg-emerald-700"
            >
              {createReview.isPending ? "Submitting…" : "Submit review"}
            </Button>
          </div>
        )}
      </div>

      <BookSessionModal
        therapist={{
          _id: therapistId!,
          firstName: therapist.firstName,
          lastName: therapist.lastName,
          sessionPrice: therapist.sessionPrice,
        }}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onBooked={() => navigate("/sessions")}
      />
    </div>
  )
}