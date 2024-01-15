/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-unmodified-loop-condition */
import { getDayOfYear } from 'date-fns'
import { Cardex, LlavesCardex } from '../models/cardex.model'
import { toast } from 'react-toastify'

interface Extensiones {
  [extension: string]: string
  pdf: string
  jpg: string
  jpeg: string
  png: string
  gif: string
}

export const hash = Math.floor(Math.random() * 90000) + 10000

export const customStyles = {
  rows: {
    style: {
      fontSize: '15px',
      minHeight: '50px' // override the row height
    }
  },
  headCells: {
    style: {
      fontSize: '15px',
      backgroundColor: '#4765a6',
      color: 'white'
    }
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px'
    }
  }
}

export const paginationOptions = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos'
}

export const initMatrix = (numRows: number, numCols: number) => {
  const rows = numRows
  const cols = numCols
  const emptyMatrix = []

  for (let i = 0; i < rows; i++) {
    const row = []

    for (let j = 0; j < cols; j++) {
      row.push('')
    }

    emptyMatrix.push(row)
  }

  return emptyMatrix
}

export const splitDayByMonth = (date: Date, days: number) => {
  const daysSplited = new Date(date)
  daysSplited.setDate(daysSplited.getDate() + days)
  return daysSplited
}

export const formatDate = (date: Date | null | undefined | string) => {
  if (!date) return ''

  const fecha = new Date(date)
  const dia = fecha.getUTCDate().toString().padStart(2, '0')
  const mes = fecha
    .toLocaleDateString('es-MX', { month: 'long' })
    .toLowerCase()
  const anio = fecha.getUTCFullYear()

  return `${dia} de ${mes} de ${anio}`
}

export const formatDefaultDate = (date: Date | null | undefined | string) => {
  if (!date) return ''

  if (typeof date === 'string') {
    const parsedDate = new Date(Date.parse(date))
    date = parsedDate
  }

  const formattedDate = formateoDate(date)

  return formattedDate
}

const formateoDate = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
  const day = ('0' + date.getUTCDate()).slice(-2)

  return `${year}/${month}/${day}`
}

export const formatDateToDB = (date: string) => {
  const formatedDateToISO = new Date(date).toISOString()

  const formatedDate = formatedDateToISO.split('-')

  const year = formatedDate[0]
  const month = formatedDate[1]
  const day = formatedDate[2].slice(0, 2)

  return `${year}/${month}/${day}`
}

export const transformDate = (date: string): string => {
  const parts = date.split('/')
  const year = parseInt(parts[2])
  const month = parseInt(parts[1]) - 1 // los meses en JavaScript van de 0 a 11
  const day = parseInt(parts[0])

  const utcDate = new Date(Date.UTC(year, month, day))

  const formattedDay = utcDate.getUTCDate().toString().padStart(2, '0')
  const formattedMonth = (utcDate.getUTCMonth() + 1).toString().padStart(2, '0')
  const formattedYear = utcDate.getUTCFullYear().toString()

  return `${formattedDay}/${formattedMonth}/${formattedYear}`
}

export const transformTime = (date: string): string => {
  const fecha = new Date(date)

  const horas = fecha.getHours().toString().padStart(2, '0')
  const minutos = fecha.getMinutes().toString().padStart(2, '0')
  const segundos = fecha.getSeconds().toString().padStart(2, '0')

  return `${horas}:${minutos}:${segundos}`
}

export const getAge = (birthDate: Date | null | undefined | string) => {
  if (!birthDate) return 0
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
}

export const getDaysDifference = (date: Date | string | null | undefined) => {
  if (!date) return 0

  const date1 = new Date(date).getTime()
  const now = Date.now()
  return Math.floor((now - date1) / (1000 * 60 * 60 * 24))
}

export const calculateAntiquity = (date: Date | string | null | undefined) => {
  const days = getDaysDifference(date)
  const years = Math.trunc(days / 365)
  const months = Math.floor((days % 365) / 30)

  return `${years} años y ${months} meses`
}

export const calculateSaldoClass = (saldoInicial: number, saldoActual: number) => {
  const percentaje = (saldoActual * 100) / saldoInicial
  if (percentaje === 0) return 'rgb(21 128 61)'
  if (percentaje <= 50) return 'rgb(161 98 7)'

  return 'rgb(185 28 28)'
}

export const formatMoney = (quantity: number) => {
  const formatter = Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  })
  return formatter.format(quantity)
}

export const getWeekDates = (weekNumber: number, year: number): { startDateString: string, endDateString: string } => {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysOffset = firstDayOfYear.getDay() - 1
  const daysOfYear = Math.floor((new Date(year, 12, 0).getTime() - firstDayOfYear.getTime()) / 86400000)
  const weekStart = new Date(year, 0, ((weekNumber - 1) * 7) - daysOffset)
  const weekEnd = new Date(year, 0, Math.min((weekNumber * 7) - 1 - daysOffset, daysOfYear))
  const startDateString = weekStart.toUTCString()
  const endDateString = weekEnd.toUTCString()

  return { startDateString, endDateString }
}

export const getNumOfWeeksSinceStartOfYear = (year: number): number => {
  const startDate = new Date(year, 0, 2)
  const actualYear = new Date().getFullYear()
  let currentDate
  if (year === actualYear) {
    currentDate = new Date()
  } else {
    currentDate = new Date(year, 11, 31)
  }
  let currentWeek = 1

  while (currentDate >= startDate) {
    currentWeek++
    startDate.setDate(startDate.getDate() + 7)
  }

  return year === actualYear ? currentWeek - 1 : currentWeek
}

export const getDayPosition = (date: string, cardex: string): string => {
  const fecha = new Date(date)
  const posicion = getDayOfYear(fecha)

  const posicionRetorno = cardex[posicion - 1]

  return posicionRetorno
}

export const filtrarRespuestas = (keys: LlavesCardex[], arregloCaracteres: string[]): LlavesCardex[] => {
  return keys.filter((objeto) => objeto.clave !== null && arregloCaracteres.includes(objeto.clave))
}

export const obtenerCaracteresUnicos = (arregloTexto: Cardex) => {
  const caracteresUnicos = new Set<string>()

  for (let i = 0; i < arregloTexto.diasa.length; i++) {
    const texto = arregloTexto.diasa[i]
    for (let j = 0; j < texto.length; j++) {
      const caracteres = texto[j].split('')
      caracteres.forEach((caracter) => caracteresUnicos.add(caracter))
    }
  }

  return Array.from(caracteresUnicos)
}

export const convertirFechaEstandar = (fecha: string): string => {
  const splitter = fecha.includes('-') ? '-' : '/'

  const parts = fecha.split(splitter)

  const day = parts[0]
  const month = parts[1]
  const year = parts[2]

  const standardDate = `${year}-${month}-${day}`

  return standardDate
}

export const showErrors = (error: any) => {
  console.log('Error: ', error.response.data.message)
  const errorMessages = error.response.data.message

  errorMessages.forEach((errorMessage: any) => {
    const { msg } = errorMessage
    toast.error(`${msg}`)
  })
}

export const getMimeTypeFromUUID = (fileExtension: string) => {
  // Mapeo de extensiones a tipos MIME
  const mimeTypeMap: Extensiones = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif'
    // Agrega más extensiones y tipos MIME según tus necesidades
  }

  // Obtener el tipo MIME correspondiente según la extensión
  return mimeTypeMap[fileExtension] || 'application/octet-stream' // 'application/octet-stream' como tipo MIME predeterminado si no se encuentra la extensión
}

export const getYearFromISODate = (date: string): number => {
  const year = new Date(date).getFullYear()
  return year
}
