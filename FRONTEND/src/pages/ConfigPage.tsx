import { Box, IconButton, InputAdornment, Paper, TextField } from '@mui/material'
import { empleadoService } from '../services/empleado.service'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '../utils/Icon'
import { toast } from 'react-toastify'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { EmpleadoData } from '../models/EmpleadoModel'

export const ConfigPage = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState({
    error: false,
    message: ''
  })

  const [errorNewPassword, setErrorNewPassword] = useState({
    error: false,
    message: ''
  })

  const [errorConfirmPassword, setErrorConfirmPassword] = useState({
    error: false,
    message: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)

  useEffect(() => {
    if (oldPassword !== '' && newPassword !== '' && confirmPassword !== '' && newPassword === confirmPassword) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [newPassword, confirmPassword, oldPassword])

  function handleSubmit (event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault()
    setIsLoading(true)

    const employeeData: EmpleadoData = JSON.parse(localStorage.getItem('empleadoData')!)

    if (!oldPassword) {
      setError({ error: true, message: 'La contrasena no coincide' })
    } else {
      setError({ error: false, message: '' })
    }

    if (newPassword !== confirmPassword) {
      setErrorNewPassword({ error: true, message: 'Las contraseñas no coinciden' })
      setErrorConfirmPassword({ error: true, message: 'Las contraseñas no coinciden' })
    } else {
      setErrorNewPassword({ error: false, message: '' })
      setErrorConfirmPassword({ error: false, message: '' })
    }

    empleadoService.changeEmployeePassword(employeeData.noempx, oldPassword, newPassword)
      .then(() => {
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        toast.success('¡Se ha cambiado la contraseña con éxito!')
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }

  return (
    <div className='container mx-auto text-center'>
      <Paper>
        <h2 className='text-md font-normal mt-0 text-center'>Cambiar Contraseña</h2>
          <Box component='form' onSubmit={handleSubmit} className='container mx-auto flex flex-col gap-4 max-w-sm py-5 px-3'>
            <TextField
              error={error.error}
              helperText={error.message}
              label='Contraseña Anterior'
              onChange={(event) => setOldPassword(event.target.value)}
              type={showPassword ? 'text' : 'password'}
              value={oldPassword}
              variant='standard'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton size='small' onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              error={errorNewPassword.error}
              helperText={errorNewPassword.message}
              label="Nueva Contraseña"
              onChange={(event) => setNewPassword(event.target.value)}
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton size='small' onClick={handleClickShowNewPassword}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              error={errorConfirmPassword.error}
              helperText={errorConfirmPassword.message}
              label="Confirma Contraseña"
              onChange={(event) => setConfirmPassword(event.target.value)}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton size='small' onClick={handleClickShowConfirmPassword}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {!isLoading
              ? (
              <button type="submit" className={`w-full text-white border-secondary bg-secondary   focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer hover:border-blue-800 hover:bg-blue-800'}`} disabled={ isButtonDisabled }>
                <div className='flex justify-center'>
                  <span className='mr-2 uppercase font-bold'>Actualizar Contraseña</span>
                  <Icon css='icon' icon={faFloppyDisk} />
                </div>
              </button>
                )
              : (
              <button type="submit" className="w-full text-gray-600 border-gray-300 bg-gray-300 focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center cursor-not-allowed">
                <span className='mr-2 uppercase font-bold'>Cargando</span>
                <div role="status">
                  <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
              </button>
                ) }

          </Box>
      </Paper>
    </div>
  )
}
