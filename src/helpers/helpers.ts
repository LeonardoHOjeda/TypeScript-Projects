import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

/*
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
/*
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
