import { ReactNode, useEffect } from 'react'
import * as Switch from '@radix-ui/react-switch'
import { useAppStore } from '../stores/useAppStore'
import { useUsers } from '../hooks/useUsers'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, darkMode, toggleDarkMode, setCurrentUser } = useAppStore()
  const { data: users } = useUsers()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (!currentUser && users && users.length > 0) {
      const defaultUser = users.find((u) => u.id === 1) || users[0]
      if (defaultUser) {
        setCurrentUser(defaultUser)
      }
    }
  }, [currentUser, users, setCurrentUser])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <nav className="border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  UserSphere
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="dark-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dark mode
              </label>
              <Switch.Root
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 transition-all duration-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle dark mode"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-300 translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-md" />
              </Switch.Root>
            </div>
          </div>
        </div>
      </nav>
      <main id="main-content" className="transition-colors duration-300" role="main">{children}</main>
    </div>
  )
}

