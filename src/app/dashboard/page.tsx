'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogOut, Plus, Trash2, Calendar, Clock, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@supabase/supabase-js'

interface Task {
  id: string
  title: string
  created_at: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      fetchTasks(user.id)
    }
    getUser()

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  const fetchTasks = async (userId: string) => {
    setLoadingTasks(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) {
      console.error(error)
    } else {
      setTasks(data || [])
    }
    setLoadingTasks(false)
  }

  const addTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newTask.trim() || !user) return

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title: newTask, user_id: user.id })
      .select()
      .single()

    if (error) {
      console.error(error)
    } else if (data) {
      setNewTask('')
      setTasks([data, ...tasks])
    }
  }

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error(error)
      // Revert on error could be implemented here
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="glass rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome, {user.email?.split('@')[0] || 'User'}</h1>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Log out</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="glass rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Your Tasks</h2>
          
          <form onSubmit={addTask} className="relative mb-8">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="glass-input w-full py-4 pl-6 pr-16 rounded-xl text-lg"
            />
            <button 
              type="submit"
              disabled={!newTask.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </form>

          {loadingTasks ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                <LayoutDashboard className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-300">No tasks yet</h3>
              <p className="text-slate-500 mt-1">Add a task above to get started</p>
            </div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.li 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors"
                  >
                    <span className="text-slate-200 text-lg">{task.title}</span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all focus:opacity-100"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}