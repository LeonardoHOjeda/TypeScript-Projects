import { Mes, Periodo } from '../models/recibos.model'
import { instance } from '../networking/axios'

class NominaService {
  async fetchMeses (year: string | number): Promise<Mes[]> {
    const employeePaysheetMonths = await instance.get(`/recibos/meses/${year}`)

    return employeePaysheetMonths.data
  }

  async fetchPeriodos (year: number, mes: number): Promise<Periodo[]> {
    const employeePeriods = await instance.get(`/recibos/periodos/${mes}/${year}`)

    return employeePeriods.data
  }

  async fetchEmployeeLatestPeriood (): Promise<any> {
    const employeeLatestPeriod = await instance.get('/nomina/ultimo-periodo')

    return employeeLatestPeriod.data
  }

  async fetchEmployeePaysheetDocument (idPeriodo: string, startDate: string, endDate: string, year: number): Promise<any> {
    const employeeRecibo = await instance.get(`/nomina/recibo-nomina?periodo=${idPeriodo}&startDate=${startDate}&endDate=${endDate}&year=${year}`, { responseType: 'blob' })

    return employeeRecibo.data
  }

  async fetchEmployeePaysheetTicket (idPeriodo: string, startDate: string, endDate: string, year: number): Promise<any> {
    const employeeTicket = await instance.get(`/nomina/ticket?periodo=${idPeriodo}&startDate=${startDate}&endDate=${endDate}&year=${year}`, { responseType: 'blob' })

    return employeeTicket.data
  }

  async fetchEmployeePaysheetTicketTimbrado (idPeriodo: string, startDate: string, endDate: string, year: number): Promise<any> {
    const employeeTicketTimbrado = await instance.get(`/nomina/ticket-timbrado?periodo=${idPeriodo}&startDate=${startDate}&endDate=${endDate}&year=${year}`, { responseType: 'blob' })

    return employeeTicketTimbrado.data
  }

  async fetchEmployeeCompletePaysheet (idPeriodo: string, startDate: string, endDate: string, year: number): Promise<any> {
    const employeeCompleteTicket = await instance.get(`/recibos/recibo?periodo=${idPeriodo}&fechaInicio=${startDate}&fechaFin=${endDate}&year=${year}`, { responseType: 'blob' })

    return employeeCompleteTicket.data
  }
}

export const nominaService = new NominaService()
