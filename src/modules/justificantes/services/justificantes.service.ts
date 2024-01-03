import { AppDataSource } from '@/database/datasources'
import { Bitacora, Incapacidades, Incidencias } from '@/entities/justificantes'
import { Justificantes } from '@/entities/justificantes/justificantes.entity'
import { Usuario } from '@/entities/usuario.entity'
import { generarFolio } from '@/helpers/helpers'
import logger from '@/helpers/logger'
import { HTTPError } from '@/middlewares/error_handler'

export class JustificantesService {
  async findAll (id_emp: number): Promise<Justificantes[]> {
    const justificantes = await Justificantes.find({
      relations: {
        incapacidad: true,
        incidencia: true,
        nivel: true
      },
      where: { id_emp }
    })

    return justificantes
  }

  async findIncidencias (): Promise<Incidencias[]> {
    const incidencias = await Incidencias.find()

    return incidencias
  }

  async findIncapacidades (): Promise<Incapacidades[]> {
    const incapacidades = await Incapacidades.find()

    return incapacidades
  }

  async store (id_emp: number, body: any): Promise<Object> {
    const empleadoWeb = await Usuario.findOne({ where: { usuario: '#EmpleadoWeb' } })

    if (empleadoWeb == null) throw new HTTPError(404, 'No se encontró el usuario #EmpleadoWeb')

    const id_usuario = empleadoWeb.id_usuario
    // Iniciar transaccion
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      // Crear Justificante
      const justificante = await queryRunner.manager.save(Justificantes, {
        id_emp,
        tipo_solicitud: parseInt(body.tipo_solicitud) === 1 ? 'A' : 'S',
        id_incidencia: parseInt(body.tipo_solicitud) !== 1 ? body.id_incidencia : null,
        id_incapacidad: parseInt(body.tipo_solicitud) === 1 ? body.id_incidencia : null,
        fecha_inicio: new Date(body.fecha_inicio),
        dias_incidencia: body.dias_incidencia,
        folio_incidencia: '',
        motivo: body.motivo ?? '',
        origen: 'K',
        id_estado_solicitud: 1,
        id_usuario
      })

      const now = new Date()

      const bitacora = await queryRunner.manager.save(Bitacora, {
        id_justificacion: justificante.id_justificacion,
        id_estado_solicitud: 1,
        fecha_aplicacion: new Date(body.fecha_inicio),
        id_usuario,
        nivel_autorizacion: 0,
        fua: now
      })

      const folio = generarFolio(justificante.id_justificacion)
      justificante.folio_incidencia = folio
      await queryRunner.manager.save(Justificantes, justificante)

      await queryRunner.commitTransaction()

      return { justificante, bitacora }
    } catch (error: any) {
      await queryRunner.rollbackTransaction()
      logger.error('Error al crear el justificante, transaccion cancelada: ', error)
      throw new HTTPError(500, 'Error al crear el justificante')
    } finally {
      await queryRunner.release()
    }
  }

  async destroy (id_justificacion: number): Promise<Object> {
    const justificante = await Justificantes.findOne({ where: { id_justificacion } })

    if (justificante == null) throw new HTTPError(404, 'No se encontró el justificante')

    if (justificante.id_estado_solicitud !== 1) throw new HTTPError(403, 'Solicitud en trámite, favor de acudir a su departamento de personal')

    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()

    await queryRunner.startTransaction()

    return {}
  }

  async delete (id: any): Promise<Object> {
    return {}
  }
}
