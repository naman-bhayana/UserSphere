import { ReactNode, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as Switch from '@radix-ui/react-switch'
import { fetchUsers } from '../lib/api/users'
import { useAppStore } from '../stores/useAppStore'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, darkMode, toggleDarkMode, setCurrentUser } = useAppStore()

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (users && users.length > 0 && !currentUser) {
      setCurrentUser(users[0])
    }
  }, [users, currentUser, setCurrentUser])

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {getInitials(currentUser.name)}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {currentUser.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="dark-mode" className="text-sm text-gray-700 dark:text-gray-300">
                Dark mode
              </label>
              <Switch.Root
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

