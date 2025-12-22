import Cookies from "js-cookie"

const SESSION_COOKIE_NAME = "fitplan_session"
const SESSION_MAX_AGE = 7 // 7 days

export interface SessionData {
  userId: string
  email: string
  fullName: string
  role: string
}

export async function createSession(data: SessionData) {
  const sessionData = JSON.stringify(data)
  Cookies.set(SESSION_COOKIE_NAME, sessionData, {
    expires: SESSION_MAX_AGE,
    path: "/",
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const sessionCookie = Cookies.get(SESSION_COOKIE_NAME)

    if (!sessionCookie) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie) as SessionData
    return sessionData
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function deleteSession() {
  Cookies.remove(SESSION_COOKIE_NAME)
}

