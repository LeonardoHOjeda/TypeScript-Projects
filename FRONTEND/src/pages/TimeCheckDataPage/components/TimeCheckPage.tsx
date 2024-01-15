/* eslint-disable @typescript-eslint/naming-convention */
import { Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import { useEffect, useState } from 'react'
import { empleadoService } from '../../../services/empleado.service'
import { getISOWeek } from 'date-fns'

export interface SelectedPeriodProps {
  onPeriodChange: (selectedPeriod: string, actualYear: string | number) => void
}

export const TimeCheckPage = ({ onPeriodChange }: SelectedPeriodProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('0')

  const [isLoading, setIsLoading] = useState(true)

  const [periodos, setPeriodos] = useState([])
  const actualYear = new Date().getFullYear()

  useEffect(() => {
    empleadoService.fetchPeriodos()
      .then((periods: any) => {
        const periodosArray = periods.map((periodoExtraido: any) => {
          const { fecha_periodo, periodo } = periodoExtraido
          const [startDateString] = fecha_periodo.split('-')
          const weekNumber = getISOWeek(new Date(startDateString)) + 1
          const periodoLabel = periodo

          return { weekNumber, periodo: periodoLabel }
        })

        setPeriodos(periodosArray)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    console.log('Periodos: ', periodos)

    console.log('selectedPeriod', selectedPeriod)
    if (selectedPeriod === '0') return
    onPeriodChange(selectedPeriod, actualYear)
    setSelectedPeriod(selectedPeriod)
  }, [selectedPeriod])

  return (
    <Paper elevation={6} className="py-3 mx-auto mb-5">
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    <h2 className='text-md font-normal mt-0 text-center'>Consulta de Tiempos</h2>
    <div className='flex md:flex-row flex-col md:justify-around text-center items-center'>
      <FormControl sx={{ m: 1, minWidth: 200, mt: 3 }} variant='standard'>
        <InputLabel id="prestamo" variant="outlined">Periodo</InputLabel>
        <Select labelId='holiday' label="Tipo de Reporte" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
          <MenuItem key={0} value={0} disabled selected>
            [Seleccione periodo]
          </MenuItem>
          {periodos.map((periodo: any, index: number) => (
            <MenuItem key={index} value={periodo.periodo}>
              {periodo.periodo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  </Paper>
  )
}
