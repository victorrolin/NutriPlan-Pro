export interface UserData {
  name: string
  age: string
  gender: string
  weight: string
  height: string
  goal: string
  specificGoal: string
  experience: string
  previousTraining: string
  frequency: string
  equipment: string[]
  muscleGroups: string[]
  limitations: string
  availability: string
  activityLevel: string
  bodyType: string
  trainingPreference: string
  preferredTime: string
  dietType: string
}

export interface AssessmentResult {
  userData: UserData
  pdfUrl?: string
  error?: string // Adicionado campo de erro
}

export interface QuestionOption {
  id: string
  label: string
  image: string
  description?: string
}

export interface Question {
  id: keyof UserData
  title: string
  subtitle: string
  type: "card-select" | "multi-select" | "text" | "number"
  options?: QuestionOption[]
  required?: boolean
}
