export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock users for demo purposes
export const MOCK_USERS = [
  {
    id: "1",
    email: "demo@tradingview.com",
    password: "demo123",
    name: "Demo User",
    avatar: "/diverse-user-avatars.png",
  },
  {
    id: "2",
    email: "trader@example.com",
    password: "trader123",
    name: "Pro Trader",
    avatar: "/trader-avatar.jpg",
  },
]
