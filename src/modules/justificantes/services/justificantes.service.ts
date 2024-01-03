import { AppDataSource } from '@/database/datasources'
import { Configuracion } from '@/entities/configuracion.entity'
import { Bitacora, Evidencia, Incapacidades, Incidencias, Tenant, Justificantes } from '@/entities/justificantes'
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

  async findBitacora (id_justificacion: number): Promise<Bitacora[]> {
    const bitacora = await Bitacora.find({
      select: {
        observaciones: true,
        fecha_aplicacion: true,
        id_estado_solicitud: true,
        justificante: {
          folio_incidencia: true
        }
      },
      relations: { justificante: true, estatus: true },
      where: { id_justificacion },
      order: { fecha_aplicacion: 'ASC' }
    })

    return bitacora
  }

  async findDiasPermitidos (): Promise<Configuracion> {
    const diasPermitidos = await Configuracion.find({
      select: { dias_captura_justificacion: true }
    })

    return diasPermitidos[0]
  }

  async findTipoCaptura (): Promise<Configuracion> {
    const tipoCaptura = await Configuracion.find({
      select: { tipo_captura_justificacion: true }
    })

    return tipoCaptura[0]
  }

  async findTenant (): Promise<Tenant> {
    const tenant = await Tenant.find()

    if (tenant.length === 0) throw new HTTPError(404, 'No se encontró ningún Tenant, favor de contactar al administrador')

    return tenant[0]
  }

  async findEvidencia (id_justificacion: number): Promise<Evidencia[]> {
    const evidencia = await Evidencia.find({ where: { id_justificacion } })

    if (evidencia.length === 0) throw new HTTPError(404, 'No se encontró evidencia para el justificante seleccionado')

    return evidencia
  }

  async findFechaInicio (id_cia: number): Promise<any> {
    const fechaInicio = await AppDataSource.query(
      `
        SELECT fecha_ini AS fecha_inicio FROM (SELECT MIN(FechaIni) AS fecha_ini FROM CalenNomina
        WHERE Id_cia = @0 AND Actualizado = 0 AND Parcial = 0 AND Año = (SELECT AnioFiscal From Config)) AS fechas;
      `, [id_cia]
    )

    return fechaInicio[0]
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

  async storeEvidencia (id_justificacion: number, referencia_evidencia:  string): Promise<any> {
    const evidencia = await Evidencia.save({
      id_justificacion,
      referencia_evidencia
    })

    return evidencia
  }

  async destroy (id_justificacion: number): Promise<Object> {
    const justificante = await Justificantes.findOne({ where: { id_justificacion } })

    if (justificante == null) throw new HTTPError(404, 'No se encontró el justificante')

    if (justificante.id_estado_solicitud !== 1) throw new HTTPError(403, 'Solicitud en trámite, favor de acudir a su departamento de personal')

    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      await queryRunner.manager.delete(Evidencia, { id_justificacion })
      await queryRunner.manager.delete(Justificantes, { id_justificacion })

      await queryRunner.commitTransaction()

      return justificante
    } catch (error: any) {
      await queryRunner.rollbackTransaction()
      logger.error('Error al eliminar el justificante, transaccion cancelada: ', error)
      throw new HTTPError(500, 'Error al eliminar el justificante')
    } finally {
      await queryRunner.release()
    }
  }
}
