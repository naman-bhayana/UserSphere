import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

export interface ActivityLogEntry {
  type: 'add' | 'edit' | 'delete'
  message: string
  timestamp: number
}

interface AppState {
  currentUser: User | null
  darkMode: boolean
  activityLog: ActivityLogEntry[]
  setCurrentUser: (user: User) => void
  toggleDarkMode: () => void
  addLog: (type: 'add' | 'edit' | 'delete', message: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      darkMode: false,
      activityLog: [],
      setCurrentUser: (user: User) => set({ currentUser: user }),
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
      name: 'usersphere-ui',
      partialize: (state) => ({
        darkMode: state.darkMode,
        activityLog: state.activityLog,
        currentUser: state.currentUser,
      }),
    }
  )
)

