"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "@/lib/auth-types"
import { MOCK_USERS } from "@/lib/auth-types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = "trading_dashboard_auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth)
        setUser(parsed.user)
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userWithoutPassword }))
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
