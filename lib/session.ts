
const SESSION_KEY = "nutriplan_session"

export interface SessionData {
  userId: string
  email: string
  fullName: string
  role: string
  lastPdfUrl?: string | null
}

export async function createSession(data: SessionData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
  }
}

export async function getSession(): Promise<SessionData | null> {
  if (typeof window === "undefined") return null

  try {
    const sessionData = localStorage.getItem(SESSION_KEY)

    if (!sessionData) {
      return null
    }

    return JSON.parse(sessionData) as SessionData
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function deleteSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY)
  }
}

