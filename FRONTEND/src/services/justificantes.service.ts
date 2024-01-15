/* eslint-disable @typescript-eslint/naming-convention */
import { Bitacora, Incapacidad, Incidencia, Justificante, JustificantesTabla } from '../models/justificantes.model'
import { Archivo } from '../models/JustificantesModel/archivoModel'
import { TEvidenciaJustificaciones } from '../models/JustificantesModel/evidenciaJustificaciones.model'
import { instance, awsInstance } from '../networking/axios'

class JustificantesService {
  async fetchJustificantes (): Promise<Justificante[]> {
    const justificantes = await instance.get('/justificantes')

    console.log(justificantes.data)

    return justificantes.data
  }

  async fetchIncidencias (): Promise<Incidencia[]> {
    const incidents = await instance.get('/justificantes/incidencias')

    return incidents.data
  }

  async fetchIncapacidades (): Promise<Incapacidad[]> {
    const disabilities = await instance.get('/justificantes/incapacidades')

    return disabilities.data
  }

  async fetchTenantId (): Promise<any> {
    const tenant = await instance.get('/justificantes/tenant')

    return tenant.data
  }

  async fetchEvidencia (id_justificacion: number): Promise<TEvidenciaJustificaciones[]> {
    const evidence = await instance.get(`/justificantes/evidencia/${id_justificacion}`)

    return evidence.data
  }

  async fetchFileByUUID (uuid: string, mimeType: string): Promise<any> {
    const file = await awsInstance.get(`/files/${uuid}`, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': mimeType
      }
    })

    const fileContent = file.data // Contenido del archivo en formato ArrayBuffer

    return fileContent
  }

  async getFileData (uuid: string): Promise<any> {
    const fileData = await awsInstance.get(`/files/single/${uuid}`)

    return fileData.data
  }

  async fetchBitacoraJustificante (id_justificante: number): Promise<Bitacora> {
    const bitacora = await instance.get(`justificantes/bitacora/${id_justificante}`)

    return bitacora.data
  }

  async fetchTipoCaptura (): Promise<any> {
    const captureType = await instance.get('/justificantes/captura')

    return captureType.data
  }

  async fetchFechaInicio (): Promise<any> {
    const startDate = await instance.get('/justificantes/fecha')

    return startDate.data.fecha_ini
  }

  async fetchDiasPermitidos (): Promise<any> {
    const maximumDays = await instance.get('/justificantes/dias')

    return maximumDays.data
  }

  // * CREATE
  async crearJustificante (id_emp: number, tipo_solicitud: number, id_incidencia: number | string, fecha_inicio: string, dias_incidencia: number, motivo: string, id_cia: number): Promise<any> {
    const request = await instance.post('/justificantes', {
      tipo_solicitud,
      id_incidencia,
      fecha_inicio,
      dias_incidencia,
      motivo,
      id_cia
    })

    return request.data
  }

  async agregarEvidencia (id_justificacion: number, referencia_evidencia: string): Promise<any> {
    const evidencia = await instance.post('/justificantes/evidencia', {
      id_justificacion,
      referencia_evidencia
    })

    return evidencia.data
  }

  async subirArchivo (file: File, tenantId: string): Promise<Archivo> {
    const formData = new FormData()
    formData.append('tenantId', tenantId)
    formData.append('file', file)
    const fileUploaded = await awsInstance.post('/files/uploadFile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

    return fileUploaded.data
  }

  // ! DELETE
  async eliminarJustificante (id_justificacion: number): Promise<JustificantesTabla> {
    const justificante = await instance.delete(`/justificantes/${id_justificacion}`)

    return justificante.data
  }
}

export const justificantesService = new JustificantesService()
