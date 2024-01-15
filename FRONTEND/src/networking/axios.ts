/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'

const getToken = (): string | null => {
  const tokenString = localStorage.getItem('token')
  return (tokenString != null) ? tokenString : null
}

const handleServerError = (error: AxiosError<any, any>) => {
  console.log(error.response)

  if (error.response?.status === 401 && error.response?.data === 'Unauthorized') {
    localStorage.clear()
    window.location.href = '/'
  } else if (error.response?.status === 500) {
    const errorMessage = error.response?.data?.message || 'Ocurrió un error al realizar esta acción.'
    toast.warn(errorMessage)
  } else if (error.response?.status === 403) {
    const errorMessage = error.response?.data?.message || 'Ocurrió un error al realizar esta acción.'
    toast.error(errorMessage)
  }

  throw error
}

// Creacion de la instancia
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`
})

// Creacion de la instancia para la segunda API
const awsInstance = axios.create({
  baseURL: `${import.meta.env.VITE_AWS_API_URL}`
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken() ?? ''
    config.headers.Authorization = `Bearer ${token}`

    return config
  })

awsInstance.interceptors.request.use(
  (config) => {
    // Puedes agregar cualquier configuración específica para esta API aquí, si es necesario.
    return config
  }
)

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any, any>) => {
    if (error.code === 'ERR_NETWORK') {
      toast.warn('Error de Red. Contacte a soporte ténico')
    } else {
      handleServerError(error)
    }
  }
)

awsInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any, any>) => {
    if (error.code === 'ERR_NETWORK') {
      toast.warn('Error de Red. Contacte a soporte técnico')
    } else {
      handleServerError(error)
    }
  }
)

export { instance, awsInstance }
