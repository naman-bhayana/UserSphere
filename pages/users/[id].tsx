import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { fetchUserById } from '../../src/lib/api/users'
import Link from 'next/link'

export default function UserDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const userId = typeof id === 'string' ? parseInt(id, 10) : undefined

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId && !isNaN(userId),
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-400">Loading user...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-red-600 dark:text-red-400">Error loading user</p>
          <Link
            href="/users"
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/users"
          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
        >
          ← Back to Users
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">User Details</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h2>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.name}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h2>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.email}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h2>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.phone}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</h2>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.company.name}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h2>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">
              {user.address.street}, {user.address.city}, {user.address.zipcode}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

