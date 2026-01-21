"use client"

import { useMemo, useState } from "react"
import { Turnstile } from "@/app/components/Turnstile"

type ContactFormProps = {
  inquiryOptions?: string[]
  successMessage?: string
}

export function ContactForm({
  inquiryOptions = ["Order", "Other"],
  successMessage = "Thanks — we’ve received your message and will get back to you shortly.",
}: ContactFormProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""

  const options = useMemo(
    () => inquiryOptions.map((o) => o.trim()).filter(Boolean),
    [inquiryOptions]
  )

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [inquiry, setInquiry] = useState(options[0] || "Other")
  const [message, setMessage] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")
  const [hp, setHp] = useState("") // honeypot

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in Name, Email, and Message.")
      return
    }
    if (!captchaToken) {
      setError("Please complete the captcha.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          inquiry,
          message,
          turnstileToken: captchaToken,
          hp,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message")
      }
      setSuccess(true)
      setName("")
      setEmail("")
      setInquiry(options[0] || "Other")
      setMessage("")
      setCaptchaToken("")
    } catch (e: any) {
      setError(e?.message || "Failed to send message")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="font-display text-2xl text-accent-dark mb-2">Message sent</div>
        <p className="text-foreground/70">{successMessage}</p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-4 inline-flex px-5 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* Honeypot field (hidden) */}
      <div style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Company
          <input value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry</label>
        <select
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
        />
      </div>

      <div className="pt-2">
        {siteKey ? (
          <Turnstile siteKey={siteKey} onToken={setCaptchaToken} />
        ) : (
          <div className="text-sm text-red-600">
            Missing `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (captcha not configured).
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex px-6 py-3 bg-accent-orange text-white font-display text-xl rounded-full hover:bg-accent-orange/90 transition-colors shadow-lg disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  )
}

