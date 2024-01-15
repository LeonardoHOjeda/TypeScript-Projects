import { Outlet, redirect } from 'react-router-dom'

export const ProtectedRoute = () => {
  return <Outlet />
}

export async function loader () {
  const data = localStorage.getItem('empleadoData')
  if (!data) return redirect('/login')
  return null
}
