import { useKV } from '@github/spark/hooks'

export interface UserData {
  id: string
  email: string
  name: string
  zodiacSign: string
  birthDate: string
  tokens: number
  createdAt: string
  isSubscribed: boolean
  subscriptionTier?: string
}

export interface UserActivity {
  id: string
  type: 'horoscope' | 'compatibility' | 'ritual' | 'career' | 'transit'
  title: string
  date: string
  tokensUsed: number
}

export interface TokenPurchase {
  id: string
  package: string
  tokens: number
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
}

// Hook to manage current user authentication state
export function useAuth() {
  const [currentUser, setCurrentUser] = useKV<UserData | null>('current-user', null)
  const [users, setUsers] = useKV<UserData[]>('cosmind-users', [])

  const login = (user: UserData) => {
    setCurrentUser(user)
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const updateUser = (updatedUser: UserData) => {
    setCurrentUser(updatedUser)
    setUsers(currentUsers => 
      currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    )
  }

  const addTokens = (tokens: number) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, tokens: currentUser.tokens + tokens }
      updateUser(updatedUser)
    }
  }

  const useTokens = (tokens: number) => {
    if (currentUser && currentUser.tokens >= tokens) {
      const updatedUser = { ...currentUser, tokens: currentUser.tokens - tokens }
      updateUser(updatedUser)
      return true
    }
    return false
  }

  return {
    currentUser,
    users,
    setUsers,
    login,
    logout,
    updateUser,
    addTokens,
    useTokens,
    isAuthenticated: !!currentUser
  }
}

// Hook to manage user activities
export function useUserActivity(userId: string) {
  const [activities, setActivities] = useKV<UserActivity[]>(`activity-${userId}`, [])

  const addActivity = async (activity: Omit<UserActivity, 'id' | 'date'>) => {
    const newActivity: UserActivity = {
      ...activity,
      id: Date.now().toString(),
      date: new Date().toISOString()
    }
    setActivities(current => [...current, newActivity])
    return newActivity
  }

  return {
    activities,
    addActivity
  }
}

// Hook to manage token purchases
export function useTokenPurchases(userId: string) {
  const [purchases, setPurchases] = useKV<TokenPurchase[]>(`purchases-${userId}`, [])

  const addPurchase = (purchase: Omit<TokenPurchase, 'id' | 'date'>) => {
    const newPurchase: TokenPurchase = {
      ...purchase,
      id: Date.now().toString(),
      date: new Date().toISOString()
    }
    setPurchases(current => [...current, newPurchase])
    return newPurchase
  }

  return {
    purchases,
    addPurchase
  }
}