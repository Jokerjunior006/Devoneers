'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
    checkUser()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-slate-950">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin z-10"></div>
    </div>
  )
}