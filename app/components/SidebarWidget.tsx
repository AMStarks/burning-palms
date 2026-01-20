import Link from "next/link"

type SidebarWidgetLink = {
  label: string
  url: string
}

type SidebarWidget = {
  id?: string
  title: string | null
  type: "text" | "links"
  content: string | null
  order: number
}

type SidebarWidgetProps = {
  widget: SidebarWidget
}

export function SidebarWidget({ widget }: SidebarWidgetProps) {
  if (!widget) return null

  const renderContent = () => {
    if (widget.type === "links" && widget.content) {
      try {
        const links: SidebarWidgetLink[] = JSON.parse(widget.content)
        if (links.length === 0) return null

        return (
          <ul className="space-y-2 text-sm text-foreground/70">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.url}
                  className="hover:text-accent-orange transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )
      } catch (error) {
        console.error("Error parsing widget links:", error)
        return null
      }
    } else if (widget.type === "text" && widget.content) {
      return (
        <p className="text-foreground/70 text-sm whitespace-pre-line">
          {widget.content}
        </p>
      )
    }
    return null
  }

  return (
    <div className="mb-6">
      {widget.title && (
        <h4 className="font-display text-lg text-accent-dark mb-3">
          {widget.title.toUpperCase()}
        </h4>
      )}
      {renderContent()}
    </div>
  )
}
