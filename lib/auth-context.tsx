"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()

  const clerkUser: User | null = user ? {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    name: user.fullName || undefined
  } : null

  const login = () => {
    // Clerk handles login through their UI components
    // This function is kept for compatibility but doesn't need to do anything
  }

  const logout = async () => {
    await signOut()
  }

  const value = {
    user: clerkUser,
    isAuthenticated: !!clerkUser,
    login,
    logout,
    loading: !isLoaded
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
