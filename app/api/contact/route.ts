import { NextResponse } from "next/server"

type ContactPayload = {
  name: string
  email: string
  inquiry: string
  message: string
  turnstileToken: string
  hp?: string
}

async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return { ok: false, error: "Missing TURNSTILE_SECRET_KEY" }
  }

  const form = new URLSearchParams()
  form.set("secret", secret)
  form.set("response", token)
  if (ip) form.set("remoteip", ip)

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  })

  const data = await res.json().catch(() => null)
  if (!data?.success) {
    return { ok: false, error: "Captcha verification failed" }
  }
  return { ok: true as const }
}

async function sendViaResend(payload: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL || "Burning Palms <no-reply@burningpalms.au>"

  if (!apiKey) return { ok: false, error: "Missing RESEND_API_KEY" }
  if (!to) return { ok: false, error: "Missing CONTACT_TO_EMAIL" }

  const subject = `[Burning Palms] Contact form: ${payload.inquiry}`
  const text =
    `Name: ${payload.name}\n` +
    `Email: ${payload.email}\n` +
    `Inquiry: ${payload.inquiry}\n\n` +
    `${payload.message}\n`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject,
      text,
    }),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => "")
    return { ok: false, error: `Email send failed: ${err || res.statusText}` }
  }

  return { ok: true as const }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as ContactPayload | null
    if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

    const name = (body.name || "").trim()
    const email = (body.email || "").trim()
    const inquiry = (body.inquiry || "").trim() || "Other"
    const message = (body.message || "").trim()
    const token = (body.turnstileToken || "").trim()
    const hp = (body.hp || "").trim()

    // Basic spam trap
    if (hp) return NextResponse.json({ ok: true })

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (!token) {
      return NextResponse.json({ error: "Missing captcha token" }, { status: 400 })
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip")

    const captcha = await verifyTurnstile(token, ip)
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: 400 })
    }

    const emailRes = await sendViaResend({ name, email, inquiry, message, turnstileToken: token, hp })
    if (!emailRes.ok) {
      return NextResponse.json({ error: emailRes.error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}

