import { getServerSession } from "@/lib/get-session"

export async function getSession() {
  return await getServerSession()
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized - Admin access required")
  }
  return session
}
