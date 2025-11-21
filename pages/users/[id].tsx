import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUserById } from '../../src/lib/api/users'
import Link from 'next/link'
import type { User } from '../../src/types'

export default function UserDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const userId = typeof id === 'string' ? parseInt(id, 10) : undefined
  const queryClient = useQueryClient()

  // First try to get user from cache (for newly added users or optimistic updates)
  const users = queryClient.getQueryData<User[]>(['users'])
  const cachedUser = users?.find((u) => u.id === userId)

  const { data: apiUser, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId && !isNaN(userId) && userId > 0 && !cachedUser, // Only fetch if positive ID and not in cache
  })

  // Use cached user if available, otherwise use API user
  const user = cachedUser || apiUser

  // Only show loading if we don't have cached user and API is loading
  const isActuallyLoading = !cachedUser && isLoading

  if (isActuallyLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading user...</p>
        </div>
      </div>
    )
  }

  // Only show error if we don't have cached user and there's an error
  if ((!cachedUser && error) || (!user && !isActuallyLoading)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">Error loading user</p>
          <Link
            href="/users"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

  // Safety check - should not happen due to error handling above, but TypeScript needs it
  if (!user) {
    return null
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 font-medium transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Users
        </Link>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
          User Details
        </h1>
        <p className="text-gray-500 dark:text-gray-400">View complete user information</p>
      </div>

      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white/30">
              {getInitials(user.name)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-blue-100">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.phone}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {user.company.name}
              </span>
            </div>

            <div className="space-y-1 md:col-span-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.address.street}, {user.address.city}, {user.address.zipcode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

