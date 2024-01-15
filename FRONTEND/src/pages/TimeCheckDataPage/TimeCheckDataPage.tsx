import { useState } from 'react'
import { TimeCheckPage } from './components/TimeCheckPage'
import { TimeCheckTable } from './components/TimeCheckTable'
import { empleadoService } from '../../services/empleado.service'
import { Alert, AlertTitle, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import { TimeCheckTableSummary } from './components/TimeCheckTableSummary'

export const TimeCheckDataPage = () => {
  const [periodInformation, setPeriodInformation] = useState([])
  const [horario, setHorario] = useState<string>('')
  const [isInformationAvailable, setIsInformationAvailable] = useState(false)
  const [isLoadingTable, setIsLoadingTable] = useState(false)

  const fetchPeriodData = (period: string, year: string | number) => {
    setIsLoadingTable(true)

    empleadoService.fetchTiempos(period).then(timeInfo => {
      setPeriodInformation(timeInfo)
      setIsInformationAvailable(true)
      setIsLoadingTable(false)
    })
      .catch((error) => toast.error(`${error.response.data.statusCode}: ${error.response.data.message}`))

    empleadoService.fetchDatosGenerales()
      .then((empleado) => setHorario(empleado.nomina.horario.horario))
      .catch((error) => toast.error(`${error.response.data.statusCode}: ${error.response.data.message}`))
  }

  return (
    <div>
      <TimeCheckPage onPeriodChange={fetchPeriodData}/>
      {!isLoadingTable
        ? (
            periodInformation.length === 0
              ? (
                  isInformationAvailable && (
              <div className="flex flex-col justify-center items-center">
                <Alert severity="warning">
                  <AlertTitle>Información Importante</AlertTitle>
                  No hay información para mostrar.
                </Alert>
              </div>
                  )
                )
              : (
            <>
              <TimeCheckTable timeData={periodInformation}/>
              <TimeCheckTableSummary timeData={periodInformation} schedule={horario}/>
            </>
                )
          )
        : (
        <div className="flex flex-col justify-center items-center">
          <CircularProgress color='secondary' />
        </div>
          )}
    </div>
  )
}
