import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

/**
* Formatear fecha a formato dd/mm/yyyy
* @param {string} date
* @returns {string}
 */
export const formatDate = (date: string) => {
  const [day, month, year] = date.split('-')
  const newDate = `${year}-${month}-${day}`

  const dateObj = new Date(newDate).toISOString()
  const dateArr = dateObj.split('-')

  const newDateArr = [dateArr[0], dateArr[1], dateArr[2].slice(0, 2)]

  return newDateArr.join('/')
}

/**
* Convertir fecha UTC a fecha local
* @param {string | Date} date
* @returns {string}
*/
export function toLocalDate (date: string | Date) {
  const fechaUTC = new Date(date)
  const offsetUTC = fechaUTC.getTimezoneOffset()
  const horaLocal = new Date(fechaUTC.getTime() - (offsetUTC * 60 * 1000))
  const horaLocalString = horaLocal.toISOString().replace('Z', '')

  return horaLocalString
}

/**
 * Generar folio de solicitud
 * Formato: K{numero_solicitud}-{año}{mes}{dia}_{hora}{minuto}{segundo}
 * Ejemplo: K01-210901_123456
 * @param {number} id
 * @returns {string}
 */
export const generarFolio = (id: number): string => {
  const now = new Date()
  const cstTimeZone = 'America/Mexico_City'
  const cstDateTime = utcToZonedTime(now, cstTimeZone)

  const year = format(cstDateTime, 'yy')
  const month = format(cstDateTime, 'MM')
  const day = format(cstDateTime, 'dd')
  const hour = format(cstDateTime, 'HH')
  const minute = format(cstDateTime, 'mm')
  const second = format(cstDateTime, 'ss')
  const prefix = 'K'
  const numeroSolicitud = id < 10 ? '0' + id.toString() : id.toString()

  return `${prefix}${numeroSolicitud}-${year}${month}${day}_${hour}${minute}${second}`
}

/**
 * Obtener los dias restantes del año
 * @param {Date} fecha
 * @returns {number}
 */
export const diasRestantes = (fecha: Date) => {
  const actualYear = fecha.getFullYear()
  const lastYearDay = new Date(actualYear, 11, 31)

  const diferenciaEnMilisegundos = lastYearDay.getTime() - fecha.getTime()

  const diasRestantes = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24))

  return diasRestantes
}

export const fechasSinHora = (fechas: Date[]) => {
  if (fechas.length === 0) return []

  const fechasSinHora = fechas.map(fecha => {
    const fechaSinHora = new Date(fecha)
    fechaSinHora.setUTCHours(0, 0, 0, 0)

    return fechaSinHora
  })

  return fechasSinHora
}

export const fechaSinHora = (fecha: Date) => {
  fecha.setUTCHours(0, 0, 0, 0)

  return fecha
}

/**
* Obtener fechas entre un rango de fechas
* @param {Date} fechaInicio
* @param {Date} fechaFin
* @returns {Date[]}
*/
export const obtenerFechasEntreRango = (fechaInicio: Date, fechaFin: Date): Date[] => {
  const fechas: Date[] = []

  // eslint-disable-next-line no-unmodified-loop-condition
  while (fechaInicio < fechaFin) {
    fechas.push(new Date(fechaInicio))
    fechaInicio.setDate(fechaInicio.getDate() + 1)
  }

  return fechas
}

/* Helpers del recibo */
export const formatoFechaLitteEndian = (date: Date | string) => {
  if (date == null) return ''

  if (typeof date === 'string') {
    date = new Date(date)
  }

  const fecha = format(date, 'dd/MM/yyyy')

  return fecha
}

// Funcion para formatear un numero a moneda
export const formatoMoneda = (numero: number) => {
  const formatter = numero.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return formatter
}
