import { Empleado } from '../models/empleado.model'
import { Nomina } from '../models/nomina.model'
import { instance } from '../networking/axios'

class EmpleadoService {
  async fetchDatosGenerales (): Promise<{ empleado: Empleado, nomina: Nomina }> {
    const empleado = await instance.get('/empleados')

    return empleado.data
  }

  async fetchFoto (): Promise<string> {
    const employeeImage = await instance.get('/empleados/foto')

    console.log(employeeImage.data)

    return employeeImage.data
  }

  // Prestamos
  async fetchPrestamos (): Promise<any> {
    const prestamos = await instance.get('/prestamos')

    return prestamos.data
  }

  async fetchConceptosPrestamos (idConcepto: string): Promise<any> {
    const conceptos = await instance.get(`/prestamos/${idConcepto}`)

    return conceptos.data
  }

  // Vacaciones
  async fetchVacaciones (idTipo: string): Promise<any> {
    const vacaciones = await instance.get(`/vacaciones/${idTipo}`)

    return vacaciones.data
  }

  // Tiempos
  async fetchPeriodos (): Promise<any> {
    const periodos = await instance.get('/tiempos/periodos')

    return periodos.data
  }

  async fetchTiempos (periodo: string): Promise<any> {
    const tiempo = await instance.get(`/tiempos?periodo=${periodo}`)

    return tiempo.data
  }

  // Fondo de Ahorro
  async fetchConceptos (): Promise<any> {
    const conceptos = await instance.get('/fondo/conceptos')

    return conceptos.data
  }

  async fetchCiclos (): Promise<any> {
    const ciclos = await instance.get('/fondo/fechas')

    console.log(ciclos.data)

    return ciclos.data
  }

  async fetchAhorro (fechaInicio: string, fechaFin: string): Promise<any> {
    const ahorro = await instance.get(`/fondo/ahorro?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)

    return ahorro.data
  }

  // TODO: Actualizar endpoint
  async changeEmployeePassword (noEmpx: string, oldNip: string, newNip: string): Promise<any> {
    const employeePassword = await instance.put('/empleados/cambiar-contrasena', {
      noEmpx,
      oldNip,
      newNip
    })

    return employeePassword.data
  }
}

export const empleadoService = new EmpleadoService()
