/* eslint-disable @typescript-eslint/naming-convention */
import { Outlet, redirect } from 'react-router-dom'

export const PublicRoute = () => {
  return <Outlet />
}

export async function loader () {
  const data = localStorage.getItem('empleadoData')
  if (data) return redirect('/')
  return null
}
