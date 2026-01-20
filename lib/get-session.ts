import { authOptions } from "@/lib/auth-config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authOptions)

export async function getServerSession() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return null
    }

    return {
      user: {
        id: (session.user as any).id || session.user.email || "",
        email: session.user.email || "",
        name: session.user.name || null,
        role: (session.user as any).role || "user",
      },
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}
