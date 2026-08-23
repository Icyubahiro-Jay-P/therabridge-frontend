import { api } from "@/lib/api"

export type PsychoedCategory = "cbt" | "anxiety" | "depression" | "stress" | "sleep" | "relationships"

export interface PsychoedStep {
  title: string
  content: string
  duration: number
}

export interface PsychoedModuleSummary {
  _id: string
  title: string
  description: string
  category: PsychoedCategory
  stepCount: number
  order: number
  progress: {
    currentStepIndex: number
    completedSteps: number[]
    completed: boolean
    completedAt: string | null
  } | null
}

export interface PsychoedModuleDetail {
  _id: string
  title: string
  description: string
  category: PsychoedCategory
  steps: PsychoedStep[]
  order: number
}

export interface PsychoedProgress {
  currentStepIndex: number
  completedSteps: number[]
  completed: boolean
  completedAt: string | null
  startedAt: string
}

export const CATEGORY_META: Record<PsychoedCategory, { label: string; color: string }> = {
  cbt: { label: "CBT", color: "emerald" },
  anxiety: { label: "Anxiety", color: "teal" },
  depression: { label: "Depression", color: "gray" },
  stress: { label: "Stress", color: "amber" },
  sleep: { label: "Sleep", color: "teal" },
  relationships: { label: "Relationships", color: "emerald" },
}

export const psychoedApi = {
  getModules: () =>
    api.get<{ modules: PsychoedModuleSummary[] }>("/api/psychoed").then((r) => r.data),

  getModule: (id: string) =>
    api.get<{ module: PsychoedModuleDetail; progress: PsychoedProgress | null }>(`/api/psychoed/${id}`).then((r) => r.data),

  startModule: (id: string) =>
    api.post<PsychoedProgress>(`/api/psychoed/${id}/start`).then((r) => r.data),

  completeStep: (id: string, stepIndex: number) =>
    api.post<PsychoedProgress>(`/api/psychoed/${id}/complete-step`, { stepIndex }).then((r) => r.data),

  getMyProgress: () =>
    api.get<{ inProgress: { module: PsychoedModuleSummary; currentStepIndex: number; completedSteps: number[] }[]; completed: { module: PsychoedModuleSummary }[] }>("/api/psychoed/progress").then((r) => r.data),
}
