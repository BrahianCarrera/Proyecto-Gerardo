// context/UserContext.tsx

import React, { createContext, useContext, useState } from 'react'

type User = {
  id: string
  name: string
  role: 'admin' | 'user'
  dietId: string
  image: null
  email: string
}

type UserContextType = {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: '219271822',
    name: 'Jose Ignacio Domingo De La Mancha',
    role: 'user',
    dietId: 'cmb5lnpne0000vphcku4bn86a',
    image: null,
    email: 'brahian.carrera1913287127893198@gmail.com',
  })

  const logout = () => setUser(null)

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
