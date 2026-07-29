import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserStore } from '@/types'

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null, isAdmin: false, isLoading: false,
      setUser: (user) => set({ user }),
      setAdmin: (isAdmin) => set({ isAdmin }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        set({ user: null, isAdmin: false })
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
      },
    }),
    { name: 'care-union-user', partialize: (s) => ({ user: s.user, isAdmin: s.isAdmin }) }
  )
)
