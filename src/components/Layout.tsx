import { ReactNode, useEffect } from 'react'
import Link from 'next/link'
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="bg-aurora" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <nav className="border-b border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-md" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" aria-label="Go to home" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg grid place-items-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <defs>
                      <linearGradient id="logoGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ffffff" />
                        <stop offset="1" stopColor="#e5e7eb" />
                      </linearGradient>
                    </defs>
                    <path d="M12 3a9 9 0 109 9h-3a6 6 0 11-6-6V3z" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2.5" fill="white" opacity="0.9" />
                  </svg>
                </div>
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  UserSphere
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="dark-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dark mode
              </label>
              <Switch.Root
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-indigo-600 transition-all duration-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle dark mode"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-300 translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-md" />
              </Switch.Root>
            </div>
          </div>
        </div>
      </nav>
      <main id="main-content" className="transition-colors duration-300" role="main">{children}</main>
      <footer className="mt-8 border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Manage users elegantly</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} UserSphere</span>
        </div>
      </footer>
    </div>
  )
}

