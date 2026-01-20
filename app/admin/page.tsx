import { getServerSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await getServerSession()
  
  const [pagesCount, postsCount, settingsCount, mediaCount] = await Promise.all([
    prisma.page.count(),
    prisma.post.count(),
    prisma.setting.count(),
    prisma.media.count(),
  ])

  const recentPages = await prisma.page.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { author: { select: { name: true, email: true } } },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-accent-dark mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link 
          href="/admin/pages"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl font-bold text-accent-dark mb-2">
            {pagesCount}
          </div>
          <div className="text-gray-600">Pages</div>
        </Link>
        <Link 
          href="/admin/posts"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl font-bold text-accent-dark mb-2">
            {postsCount}
          </div>
          <div className="text-gray-600">Posts</div>
        </Link>
        <Link 
          href="/admin/media"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl font-bold text-accent-dark mb-2">
            {mediaCount}
          </div>
          <div className="text-gray-600">Media Files</div>
        </Link>
        <Link 
          href="/admin/settings"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl font-bold text-accent-dark mb-2">
            {settingsCount}
          </div>
          <div className="text-gray-600">Settings</div>
        </Link>
      </div>

      {/* Recent Pages */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-display text-2xl text-accent-dark">
            Recent Pages
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No pages yet. <Link href="/admin/pages/new" className="text-accent-orange hover:underline">Create one</Link>
                  </td>
                </tr>
              ) : (
                recentPages.map((page) => (
                  <tr key={page.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {page.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        /{page.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.author.name || page.author.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/pages/${page.id}`}
                        className="text-accent-orange hover:text-accent-orange/80"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

