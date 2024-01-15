import { Backdrop, CircularProgress, Paper } from '@mui/material'
import { Nomina } from './components/Nomina'
import { DatosGenerales, Domicilio, Emergencia } from './components'
import { useEffect, useState } from 'react'
import { empleadoService } from '../../services/empleado.service'
import { Empleado } from '../../models/empleado.model'
import { Nomina as NominaModel } from '../../models/nomina.model'

export const GeneralDataPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [empleado, setEmpleado] = useState<{ empleado: Empleado, nomina: NominaModel }>()

  useEffect(() => {
    setIsLoading(true)
    empleadoService.fetchDatosGenerales()
      .then((empleado) => setEmpleado(empleado))
      .catch(console.log)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
    {isLoading
      ? (
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
        )
      : (
      <>
        <Paper elevation={6} className="py-3 px-10 mx-auto">
          <h2 className='text-md font-normal mt-0 text-center'>Datos Generales</h2>
          <DatosGenerales empleado={empleado!.empleado} />
        </Paper>

        <Paper elevation={6} className="py-3 px-10 mx-auto mt-2">
          <h2 className='text-md font-normal mt-0 text-center'>Datos Nómina</h2>
          <Nomina empleado={empleado!.empleado} nomina={empleado!.nomina} />
        </Paper>

        <Paper elevation={6} className="py-3 px-10 mx-auto mt-2">
          <h2 className='text-md font-normal mt-0 text-center'>Domicilio</h2>
          <Domicilio empleado={empleado!.empleado} />
        </Paper>

        <Paper elevation={6} className="py-3 px-10 mx-auto mt-2 mb-5">
          <h2 className='text-md font-normal mt-0 text-center'>En caso de emergencia</h2>
          <Emergencia empleado={empleado!.nomina} />
        </Paper>
      </>
        )}
    </>
  )
}
