import { Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { Key, useEffect, useState } from 'react'
import { Icon } from '../../../utils/Icon'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
import { cardexService } from '../../../services/cardex.service'
import { nominaService } from '../../../services/nomina.service'
import { MesesModels } from '../../../models/MesesModel'
import { toast } from 'react-toastify'
import { convertirFechaEstandar } from '../../../utils/helpers'
import { CardexYears } from '../../../models/cardex.model'
import { Periodo } from '../../../models/recibos.model'

export const Opciones = () => {
  const [isLoadingYears, setIsLoadingYears] = useState(true)
  const [isLoadingButton, setIsLoadingButton] = useState(false)

  const [periods, setPeriods] = useState<Periodo[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('0')

  const [months, setMonths] = useState<MesesModels[]>([])
  const [selectedMonths, setSelectedMonths] = useState(0)

  const [years, setYears] = useState<CardexYears[]>([])
  const [selectedYear, setSelectedYear] = useState(0)

  const [selectedRecibo, setSelectedRecibo] = useState(0)

  useEffect(() => {
    cardexService.fetchYears()
      .then((years) => {
        setIsLoadingYears(false)
        setYears(years)
        setSelectedYear(0)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    if (selectedYear === 0) return
    setSelectedYear(selectedYear)
    setSelectedMonths(0)
    nominaService.fetchMeses(selectedYear)
      .then((months) => {
        setMonths(months)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [selectedYear])

  useEffect(() => {
    if (selectedMonths === 0) return
    setSelectedMonths(selectedMonths)
    nominaService.fetchPeriodos(selectedYear, selectedMonths)
      .then(periodo => {
        setSelectedPeriod('0')
        setPeriods(periodo)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [selectedMonths])

  const generarRecibo = () => {
    const periodo = selectedPeriod
    let startDate = ''
    let endDate = ''

    setIsLoadingButton(true)

    periods.filter((period: Periodo) => {
      if (period.id_periodo === periodo) {
        const periodDates = period.periodo
        const dateRange = periodDates.split('al')
        startDate = convertirFechaEstandar(dateRange[0].trim())
        endDate = convertirFechaEstandar(dateRange[1].substring(1, 11))

        return true
      }

      return false
    })

    if (selectedRecibo === 1) {
      generarReciboCompleto(periodo, startDate, endDate, selectedYear)
    }
  }

  const generarReciboCompleto = (periodo: string, startDate: string, endDate: string, year: number) => {
    nominaService.fetchEmployeeCompletePaysheet(periodo, startDate, endDate, year)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' })

        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = 'Recibo_Nomina.pdf' // Nombre del archivo de descarga
        link.click()
        toast.success('Recibo generado correctamente')
      })
      .catch((error) => {
        console.log('Error al obtener el recibo: ', error)
        toast.error('Error al generar el recibo')
      })
      .finally(() => {
        setIsLoadingButton(false)
      })
  }

  return (
    <>
      <Backdrop open={isLoadingYears} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className='text-center flex md:flex-row md:justify-around flex-col items-center'>
        <FormControl variant="standard" className='mb-5' sx={{ m: 1, minWidth: 200, mt: 3 }}>
          <InputLabel id="year">Año</InputLabel>
          <Select
            labelId="year"
            value={selectedYear}
            label="Year"
            onChange={(event) => setSelectedYear(+event.target.value)}
          >
            <MenuItem key={0} value={0} disabled selected>
              [Seleccione año]
            </MenuItem>
            {years.map((year) => (
              <MenuItem key={year.acardex} value={year.acardex}>
                {year.acardex}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" className='mb-5' sx={{ m: 1, minWidth: 200, mt: 3 }}>
        <InputLabel id="month">Mes</InputLabel>
          <Select
            labelId="month"
            disabled={selectedYear === 0}
            value={selectedMonths}
            label="Month"
            onChange={(event) => setSelectedMonths(+event.target.value)}
          >
            <MenuItem key={0} value={0} disabled selected>
              [Seleccione mes]
            </MenuItem>
            {months.map((month) => (
              <MenuItem key={month.numMes} value={month.numMes}>
                {month.mes}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className='text-center flex md:flex-row md:justify-around flex-col items-center'>
        <FormControl variant="standard" className='mb-5' sx={{ m: 1, minWidth: 200, mt: 3 }}>
          <InputLabel id="period">Periodo</InputLabel>
          <Select
            labelId="period"
            value={selectedPeriod}
            label="period"
            disabled={selectedMonths === 0}
            onChange={event => setSelectedPeriod(event.target.value)}
          >
            <MenuItem key={0} value={0} disabled selected>
              [Seleccione periodo]
            </MenuItem>
            {periods.map((period: Periodo, index: Key) => (
              <MenuItem key={index} value={period.id_periodo}>
                {period.periodo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" className='mb-5' sx={{ m: 1, minWidth: 200, mt: 3 }}>
        <InputLabel id="year">Recibo</InputLabel>
          <Select
            labelId="year"
            value={selectedRecibo}
            label="Year"
            disabled={selectedPeriod === '0'}
            onChange={(event) => setSelectedRecibo(+event.target.value)}
          >
            <MenuItem key={'0'} value={'0'} disabled selected>
              [Seleccione recibo]
            </MenuItem>
            <MenuItem key={1} value={1}>
              Recibo
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      {isLoadingButton
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
                <button onClick={generarRecibo} className={`w-full text-white border-secondary bg-secondary   focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center ${selectedRecibo === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:border-blue-800 hover:bg-blue-800'}`} disabled={selectedRecibo === 0}>
                  <div className='flex justify-center'>
                    <span className='mr-2 uppercase font-bold'>Generar Recibo</span>
                    <Icon css='icon' icon={faFilePdf} />
                  </div>
                </button>
          )
      }
    </>
  )
}
