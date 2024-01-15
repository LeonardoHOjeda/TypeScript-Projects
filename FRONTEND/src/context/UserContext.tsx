import { createContext, useContext, useEffect, useState } from 'react'

interface ContextType {
  id_emp: number
  noempx: string
  nombre: string
  empresa: string
  login: (info: { idEmp: number, noEmpx: string, nombre: string, empresa: string }) => void
  isLoggedIn: () => boolean
  logout: () => void
}

const UserContext = createContext<ContextType | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [idEmp, setIdEmp] = useState(0)
  const [noempx, setNoempx] = useState('')
  const [nombre, setNombre] = useState('')
  const [empresa, setEmpresa] = useState('')

  const login = (info: { idEmp: number, noEmpx: string, nombre: string, empresa: string }) => {
    setIdEmp(info.idEmp)
    setNoempx(info.noEmpx)
    setNombre(info.nombre)
    setEmpresa(info.empresa)
  }

  const logout = () => {
    setIdEmp(0)
    setNoempx('')
    setNombre('')
    setEmpresa('')
    localStorage.clear()
  }

  useEffect(() => {
    const info = (localStorage.getItem('empleadoData') != null) ? JSON.parse(localStorage.getItem('empleadoData')!) : null
    setIdEmp(info?.id_emp ?? 0)
    setNoempx(info?.noempx ?? '')
    setNombre(info?.nombre ?? '')
    setEmpresa(info?.empresa ?? '')
  }, [])

  const isLoggedIn = () => idEmp !== 0

  return <UserContext.Provider value={{ id_emp: idEmp, noempx, nombre, empresa, login, isLoggedIn, logout }}> {children} </UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)!
