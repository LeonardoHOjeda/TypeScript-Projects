import { CircularProgress } from '@mui/material'
import { HolidayType } from './components/Selector'
import { Desglose } from './components/Desglose'
import { empleadoService } from '../../services/empleado.service'
import { useState } from 'react'
import { Vacaciones } from '../../models/vacaciones.model'
import { HolidayTotalTable } from './components/HolidayTotalTable'

export const VacacionesPage = () => {
  const [vacaciones, setVacaciones] = useState<Vacaciones[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchHolidayData = (tipo: string) => {
    setIsLoading(true)
    empleadoService.fetchVacaciones(tipo)
      .then(holidayInfo => {
        if (holidayInfo == null) {
          setVacaciones([])
        } else {
          setVacaciones(holidayInfo)
        }
        setIsLoading(false)
      })
      .catch(console.log)
  }
  return (
    <>
      <HolidayType onHolidayChange={fetchHolidayData} />
      {isLoading
        ? (
      <div className="flex flex-col justify-center items-center">
        <CircularProgress color='secondary' />
      </div>)
        : (
        <>
          <Desglose vacaciones={vacaciones} />
          <HolidayTotalTable holidayData={vacaciones}/>
        </>
          )}
    </>
  )
}
