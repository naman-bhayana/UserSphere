import { ReactNode, useEffect } from 'react'
import * as Switch from '@radix-ui/react-switch'
import { useAppStore } from '../stores/useAppStore'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, darkMode, toggleDarkMode } = useAppStore()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

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
              {currentUser && (
                <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-white dark:ring-gray-800 transition-transform hover:scale-105">
                    {getInitials(currentUser.name)}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {currentUser.name}
                  </span>
                </div>
              )}
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

