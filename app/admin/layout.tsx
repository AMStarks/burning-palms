import Link from "next/link"
import Image from "next/image"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Authentication temporarily disabled

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center space-x-3">
                <Image 
                  src="/logo.png" 
                  alt="Burning Palms Logo" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
                <span className="font-display text-xl text-accent-dark">
                  ADMIN
                </span>
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link 
                  href="/admin" 
                  className="text-gray-700 hover:text-accent-orange px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/page-builder"
                  className="text-gray-700 hover:text-accent-orange px-3 py-2 rounded-md text-sm font-medium"
                >
                  Page Builder
                </Link>
                <Link 
                  href="/admin/posts" 
                  className="text-gray-700 hover:text-accent-orange px-3 py-2 rounded-md text-sm font-medium"
                >
                  Posts
                </Link>
                <Link 
                  href="/admin/settings" 
                  className="text-gray-700 hover:text-accent-orange px-3 py-2 rounded-md text-sm font-medium"
                >
                  Settings
                </Link>
                <Link 
                  href="/admin/media" 
                  className="text-gray-700 hover:text-accent-orange px-3 py-2 rounded-md text-sm font-medium"
                >
                  Media
                </Link>
                <Link 
                  href="/admin/menus" 
                  className="text-gray-700 hover:text-accent-orange px-3 py-2 rounded-md text-sm font-medium"
                >
                  Menus
                </Link>
            <Link
              href="/admin/footer-widgets"
              className="text-gray-700 hover:text-accent-orange px-3 py-2 rounded-md text-sm font-medium"
            >
              Footer Widgets
            </Link>
            <Link
              href="/admin/sidebar-widgets"
              className="text-gray-700 hover:text-accent-orange px-3 py-2 rounded-md text-sm font-medium"
            >
              Sidebar Widgets
            </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                target="_blank"
                className="text-gray-700 hover:text-accent-orange text-sm"
              >
                View Site
              </Link>
              <span className="text-gray-500 text-sm">
                Admin
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

