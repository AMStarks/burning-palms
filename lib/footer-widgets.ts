import { prisma } from "./prisma"

export type FooterWidgetLink = {
  label: string
  url: string
}

export type FooterWidget = {
  id: string
  columnIndex: number
  title: string | null
  type: string
  content: string | null
  order: number
}

/**
 * Get all footer widgets, grouped by column
 */
export async function getFooterWidgets(): Promise<Record<number, FooterWidget[]>> {
  try {
    const widgets = await prisma.footerWidget.findMany({
      orderBy: [
        { columnIndex: "asc" },
        { order: "asc" },
      ],
    })

    // Group by column index
    const grouped: Record<number, FooterWidget[]> = {}
    for (const widget of widgets) {
      if (!grouped[widget.columnIndex]) {
        grouped[widget.columnIndex] = []
      }
      grouped[widget.columnIndex].push(widget as FooterWidget)
    }

    return grouped
  } catch (error) {
    console.error("Error fetching footer widgets:", error)
    return {}
  }
}

/**
 * Parse widget content based on type
 */
export function parseWidgetContent(widget: FooterWidget): any {
  if (!widget.content) return null

  try {
    return JSON.parse(widget.content)
  } catch (error) {
    console.error("Error parsing widget content:", error)
    return null
  }
}
