import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

export interface ActivityLogEntry {
  type: 'add' | 'edit' | 'delete'
  message: string
  timestamp: number
}

interface AppState {
  currentUser: User | undefined
  darkMode: boolean
  activityLog: ActivityLogEntry[]
  setCurrentUser: (user: User | undefined) => void
  toggleDarkMode: () => void
  addLog: (type: 'add' | 'edit' | 'delete', message: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: undefined,
      darkMode: false,
      activityLog: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      addLog: (type, message) =>
        set((state) => ({
          activityLog: [
            { type, message, timestamp: Date.now() },
            ...state.activityLog,
          ].slice(0, 50),
        })),
    }),
    {
      name: 'app-storage',
    }
  )
)

