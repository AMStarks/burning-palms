import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 32,
  height: 32,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ff6b35",
          borderRadius: 8,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="#ffffff"
            d="M12 2c-2.6 0-4.4 1.3-5.6 3 2.2-.4 4.2.2 5.6 1.4C13.4 5.2 15.4 4.6 17.6 5c-1.2-1.7-3-3-5.6-3Z"
          />
          <path
            fill="#ffffff"
            d="M5.6 6.4C3.8 6.8 2.6 8 2 9.6c2.3-.8 4.6-.5 6.2.6.4.3.7.6 1 .9-.2-1.9-1.4-3.6-3.6-4.7Z"
          />
          <path
            fill="#ffffff"
            d="M18.4 6.4c2.2 1.1 3.4 2.8 3.6 4.7-.3-.3-.6-.6-1-.9-1.6-1.1-3.9-1.4-6.2-.6.6-1.6 1.8-2.8 3.6-3.2Z"
          />
          <path
            fill="#ffffff"
            d="M9.7 12.3c.6 2.8-.5 6.2-2.6 9.7h2.2c1.2-2.4 1.9-4.6 2.2-6.4.3 1.8 1 4 2.2 6.4h2.2c-2.1-3.5-3.2-6.9-2.6-9.7-.5-.6-1.2-1.1-2-1.4-.8.3-1.5.8-2 1.4Z"
          />
        </svg>
      </div>
    ),
    size
  )
}

