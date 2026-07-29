'use client'
import { useEffect, useRef } from 'react'
import { useUserStore } from '@/store/userStore'

export function useAuth() {
  const { setUser, setAdmin, setLoading } = useUserStore()
  const called = useRef(false)
  useEffect(() => {
    if (called.current) return
    called.current = true
    setLoading(true)
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); if (d.isAdmin) setAdmin(true) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [setUser, setAdmin, setLoading])
}
