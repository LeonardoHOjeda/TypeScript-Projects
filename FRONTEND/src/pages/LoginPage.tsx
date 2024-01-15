/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react'
import NomiLogo from '../assets/img/nomifacil-logo.png'
import BackNomi from '../assets/img/nomi-background.png'
import { Icon } from '../utils/Icon'
import { faCircleChevronRight, faCircleXmark, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { authService } from '../services/auth.service'
import { useUserContext } from '../context/UserContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

export const LoginPage = () => {
  const [isEmptyNoempx, setIsEmptyNoempx] = useState(false)
  const [isEmptyPassword, setIsEmptyPassword] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useUserContext()
  const navigate = useNavigate()

  function handleNoempxChange (event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value)
    setIsEmptyNoempx(event.target.value === '')
    setIsButtonDisabled(event.target.value === '' || isEmptyPassword)
  }

  function handlePasswordChange (event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
    setIsEmptyPassword(event.target.value === '')
    setIsButtonDisabled(event.target.value === '' || isEmptyNoempx)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const resp = await authService.login(username, password)
      login({ idEmp: resp.id_emp, noEmpx: resp.noempx, nombre: resp.nombre, empresa: resp.empresa })
      navigate('/', { replace: true })
    } catch (error: any) {
      setIsLoading(false)
      console.log('Error en handleSubmit: ', error)
      toast.error(error.response.data.message, { icon: ({ theme, type }) => <Icon icon={faCircleXmark} css='icon' /> })
    }
  }

  return (
    <div className={'h-screen bg-cover bg-no-repeat bg-center'} style={{ backgroundImage: `url(${BackNomi})` }}>
      <div className='container mx-auto max-w-sm p-5'>
        <form onSubmit={handleSubmit}>
          <div className='text-center md:mt-20'>
            <img src={NomiLogo} alt="Logo" className='mx-auto w-92' />
            <p className='font-bold text-xl'>Sistema Integral de Recursos Humanos</p>
          </div>
          <div className="relative mb-6">
            <label htmlFor='username' className={`${isEmptyNoempx ? 'text-red-700' : 'text-gray-900'} block mb-2 text-sm font-medium `}>Nombre de Usuario</label>
            <div className="flex">
              <span className={`${isEmptyNoempx ? 'bg-red-500' : 'bg-secondary'} inline-flex items-center px-3 text-sm text-white border border-r-0 border-gray-300 rounded-l-md`}>
                <Icon css='icon' icon={faUser} />
              </span>
              <input type="text" id="username" className={`${isEmptyNoempx ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700' : 'focus:ring-blue-500 focus:border-blue-500'} rounded-none rounded-r-lg bg-gray-50 border text-gray-900  block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5`} placeholder="Nombre de Usuario" onChange={handleNoempxChange} />
            </div>
            {isEmptyNoempx && (<p className="mt-2 text-sm text-red-600 dark:text-red-500">El nombre de usuario no puede estar vacío</p>)}
          </div>
          <div className="relative mb-6">
            <label htmlFor='password' className={`${isEmptyPassword ? 'text-red-700' : 'text-gray-900'} block mb-2 text-sm font-medium `}>Contraseña</label>
            <div className="flex">
              <span className={`${isEmptyPassword ? 'bg-red-500' : 'bg-secondary'} inline-flex items-center px-3 text-sm text-white border border-r-0 border-gray-300 rounded-l-md`}>
                <Icon css='icon' icon={faLock} />
              </span>
              <input type="password" id="password" className={`${isEmptyPassword ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500' : 'focus:ring-blue-500 focus:border-blue-500 text-gray-900'} rounded-none rounded-r-lg bg-gray-50 border    block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5`} placeholder="Contraseña" onChange={handlePasswordChange} />
            </div>
            {isEmptyPassword && (<p className="mt-2 text-sm text-red-600 dark:text-red-500">La contraseña no puede estar vacía</p>)}
          </div>
          <div className='w-full'>
            {isLoading
              ? (
                <button type="submit" className="w-full text-gray-600 border-gray-300 bg-gray-300 focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center cursor-not-allowed">
                  <span className='mr-2 uppercase font-bold'>Cargando</span>
                  <div role="status">
                    <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                  </div>
                </button>
                )
              : (
                <button type="submit" className={`w-full text-white border-secondary bg-secondary   focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:border-blue-800 hover:bg-blue-800'}`} disabled={isButtonDisabled}>
                  <div className='flex justify-center'>
                    <span className='mr-2 uppercase font-bold'>Ingresar</span>
                    <Icon css='icon' icon={faCircleChevronRight} />
                  </div>
                </button>
                )
            }
          </div>
        </form>
        <p className='text-center'>Si tienes problemas con tu acceso al sistema contacta a nuestro Soporte Técnico en <a href="mailto:contacto@nomifacilmx.com" className='font-bold'>contacto@nomifacilmx.com</a> </p>
      </div>
    </div>
  )
}
