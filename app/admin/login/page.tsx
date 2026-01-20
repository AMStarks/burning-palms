"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        console.error("Sign in error:", result.error)
        setError(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error)
      } else if (result?.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (error) {
      console.error("Login exception:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              alt="Burning Palms Logo" 
              width={80} 
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="font-display text-4xl text-accent-dark mb-2">
            BURNING PALMS
          </h1>
          <p className="text-foreground/70">Admin Login</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-accent-brown/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-accent-brown/30 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                placeholder="andrewmartinstarkey@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-accent-brown/30 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-accent-orange text-white font-display text-lg rounded-lg hover:bg-accent-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-foreground/70 hover:text-accent-orange text-sm">
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  )
}
