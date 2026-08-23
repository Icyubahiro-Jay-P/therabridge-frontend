import { api } from "@/lib/api"

export interface AssessmentResponse {
  questionIndex: number
  value: number
}

export interface Assessment {
  _id: string
  type: string
  typeName: string
  description?: string
  responses?: AssessmentResponse[]
  score: number
  severity: string
  severityLabel: string
  maxScore: number
  createdAt: string
}

export interface AssessmentTrendPoint {
  date: string
  score: number
  severity: string
  severityLabel: string
}

export interface AssessmentTrend {
  type: string
  typeName: string
  trend: AssessmentTrendPoint[]
}

export const ASSESSMENT_QUESTIONS: Record<string, { title: string; description: string; questions: string[] }> = {
  phq9: {
    title: "PHQ-9",
    description: "Patient Health Questionnaire, Over the last 2 weeks, how often have you been bothered by...",
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself, or that you're a failure",
      "Trouble concentrating on things",
      "Moving or speaking slowly / being fidgety or restless",
      "Thoughts that you would be better off dead, or of hurting yourself",
    ],
  },
  gad7: {
    title: "GAD-7",
    description: "Generalized Anxiety Disorder, Over the last 2 weeks, how often have you been bothered by...",
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it's hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid, as if something awful might happen",
    ],
  },
  pss: {
    title: "PSS-10",
    description: "Perceived Stress Scale, Over the past month, how often have you...",
    questions: [
      "Been upset because of something that happened unexpectedly",
      "Felt that you were unable to control the important things in your life",
      "Felt nervous and stressed",
      "Felt confident about your ability to handle your personal problems (R)",
      "Felt that things were going your way (R)",
      "Found that you could not cope with all the things you had to do",
      "Been able to control irritations in your life (R)",
      "Felt that you were on top of things (R)",
      "Been angered because of things outside your control",
      "Felt difficulties were piling up so high that you could not overcome them",
    ],
  },
  k10: {
    title: "K10",
    description: "Kessler Psychological Distress, Over the past 4 weeks, about how often did you...",
    questions: [
      "Feel tired out for no good reason",
      "Feel nervous",
      "Feel so nervous that nothing could calm you down",
      "Feel hopeless",
      "Feel restless or fidgety",
      "Feel so restless you could not sit still",
      "Feel depressed",
      "Feel that everything was an effort",
      "Feel so sad that nothing could cheer you up",
      "Feel worthless",
    ],
  },
}

export const RESPONSE_OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
]

export const assessmentApi = {
  take: (data: { type: string; responses: AssessmentResponse[] }) =>
    api.post<Assessment>("/api/assessments", data).then((r) => r.data),

  list: (params?: { type?: string; page?: number }) =>
    api.get<{ assessments: Assessment[]; total: number }>("/api/assessments", { params }).then((r) => r.data),

  get: (id: string) => api.get<Assessment>(`/api/assessments/${id}`).then((r) => r.data),

  trend: (type: string) =>
    api.get<AssessmentTrend>("/api/assessments/trend", { params: { type } }).then((r) => r.data),

  delete: (id: string) => api.delete(`/api/assessments/${id}`).then((r) => r.data),
}
