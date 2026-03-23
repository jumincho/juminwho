import { supabase } from './supabase'

const ADMIN_EMAIL = ((import.meta.env.VITE_ADMIN_EMAIL as string) || '').trim()
const LOCAL_ADMIN_PASSWORD = ((import.meta.env.VITE_ADMIN_PASSWORD as string) || 'admin').trim()
const LOCAL_ADMIN_SESSION_KEY = 'local-admin-session'

function setLocalAdminSession(isAuthenticated: boolean) {
  if (typeof window === 'undefined') return

  if (isAuthenticated) {
    window.localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, '1')
    return
  }

  window.localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY)
}

function hasLocalAdminSession() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(LOCAL_ADMIN_SESSION_KEY) === '1'
}

export async function signInAdmin(password: string) {
  if (password === LOCAL_ADMIN_PASSWORD) {
    setLocalAdminSession(true)
    return null
  }

  if (!supabase || !ADMIN_EMAIL) {
    return 'Admin auth is not configured.'
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password,
  })
  return error ? error.message : null
}

export async function signOutAdmin() {
  setLocalAdminSession(false)
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (hasLocalAdminSession()) {
    return { source: 'local-admin' }
  }

  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}
