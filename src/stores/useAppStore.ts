import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AppState {
  currentUser: User | undefined
  darkMode: boolean
  setCurrentUser: (user: User | undefined) => void
  toggleDarkMode: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: undefined,
      darkMode: false,
      setCurrentUser: (user) => set({ currentUser: user }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'app-storage',
    }
  )
)

