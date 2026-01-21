import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #faf8f3 0%, #ffb3471a 45%, #ff6b351a 100%)",
          padding: 64,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 32,
            border: "2px solid rgba(93, 64, 55, 0.15)",
            background: "rgba(250, 248, 243, 0.9)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 72,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "#ff6b35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: 1,
              }}
            >
              BP
            </div>
            <div style={{ color: "#5d4037", fontSize: 22, opacity: 0.85 }}>
              burningpalms.au
            </div>
          </div>

          <div
            style={{
              color: "#5d4037",
              fontSize: 86,
              fontWeight: 900,
              letterSpacing: 2,
              lineHeight: 1.05,
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            Burning Palms
          </div>

          <div style={{ color: "#8b4513", fontSize: 34, opacity: 0.9, maxWidth: 900 }}>
            Retro 70s Australian Surf & Street Wear
          </div>
        </div>
      </div>
    ),
    size
  )
}

