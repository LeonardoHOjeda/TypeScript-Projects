import { toast } from 'react-toastify'
import { Periodo } from '../models/Periodo.model'
import { nominaService } from '../services/nomina.service'
import { useEffect, useState } from 'react'
import { convertirFechaEstandar, getYearFromISODate } from '../utils/helpers'

export const HomePage = () => {
  const [isLoadingButton, setIsLoadingButton] = useState(false)
  const [periods, setPeriods] = useState([])

  useEffect(() => {
    nominaService.fetchEmployeeLatestPeriood()
      .then((periods) => {
        setPeriods(periods)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const downloadPaysheet = () => {
    setIsLoadingButton(true)
    const periodo: Periodo = periods[0]
    let startDate = ''
    let endDate = ''
    const year = getYearFromISODate(periodo.periodo)

    const periodDates = periodo.periodo
    const dateRange = periodDates.split('al')
    startDate = convertirFechaEstandar(dateRange[0].trim())
    endDate = convertirFechaEstandar(dateRange[1].substring(1, 11))

    console.log('Periodo: ', periodo.periodo)
    generarReciboCompleto(periodo.id_periodo as string, startDate, endDate, year)

    // setIsLoadingButton(true)
    console.log('Descargando recibo de pago')
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
        console.log('Error al generar el recibo: ', error)
        toast.error('Error al generar el recibo')
      })
      .finally(() => {
        setIsLoadingButton(false)
      })
  }

  return (
    <>
      <h1 className='uppercase text-center'>¡Bienvenido al sistema!</h1>
      <div className='h-96 flex flex-col justify-center'>
        <div className='flex flex-col md:flex-row w-full px-3 gap-2 justify-center md:items-center text-center'>
          {isLoadingButton
            ? (
            <button type="submit" className="w-72 text-gray-600 border-gray-300 bg-gray-300 focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center cursor-not-allowed">
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
              <button onClick={downloadPaysheet} className='text-white border-secondary bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold uppercase rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center hover:cursor-pointer hover:bg-blue-700'>Imprima aqui su ultimo recibo</button>
              )}
               <button className='text-white border-secondary bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 uppercase rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center hover:cursor-pointer hover:bg-blue-700 font-bold'>
                <a href="https://timbrefacil.net/Pruebas/ingresarConMaster.aspx" target='_blank' rel="noreferrer">
                  Ingresar a TimbreFacil
                </a>
              </button>
        </div>
      </div>
    </>
  )
}
