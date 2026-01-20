import Link from "next/link"

type MenuItem = {
  id?: string
  label: string
  url: string
  order: number
  children?: MenuItem[]
}

type MenuProps = {
  items: MenuItem[]
  className?: string
  itemClassName?: string
}

export function Menu({ items, className = "", itemClassName = "" }: MenuProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <>
      {items.map((item) => (
        <MenuItem key={item.id || item.url} item={item} itemClassName={itemClassName} />
      ))}
    </>
  )
}

function MenuItem({ item, itemClassName }: { item: MenuItem; itemClassName: string }) {
  const hasChildren = item.children && item.children.length > 0

  return (
    <div className="relative group">
      <Link
        href={item.url}
        className={`text-foreground hover:text-accent-orange transition-colors ${itemClassName}`}
      >
        {item.label}
      </Link>
      {hasChildren && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="py-2">
            {item.children!.map((child) => (
              <Link
                key={child.id || child.url}
                href={child.url}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent-orange transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
