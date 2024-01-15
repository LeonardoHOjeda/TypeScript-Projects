import { diasRestantes, fechaSinHora, fechasSinHora, obtenerFechasEntreRango } from '@/helpers/helpers'
import { bodyValidator } from '@/middlewares/validator'
import { check } from 'express-validator'
import { JustificantesService } from './services'
import { AppDataSource } from '@/database/datasources'

export const storeValidators = [
  check('tipo_solicitud')
    .notEmpty().withMessage('Es obligatorio el campo tipo_solicitud')
    .isNumeric().withMessage('Es obligatorio que el campo tipo_solicitud sea numerico'),
  check('id_incidencia').isNumeric().withMessage('Es obligatorio que el campo id_incidencia sea numerico'),
  check('motivo').isLength({ max: 200 }).withMessage('El campo motivo debe de tener maximo 200 caracteres'),
  check('dias_incidencia')
    .notEmpty().withMessage('Es obligatorio el campo dias_incidencia')
    .isNumeric().withMessage('Es obligatorio que el campo dias_incidencia sea numerico')
    .isInt({ min: 1 }).withMessage('Debe de haber al menos un dia de incidencia')
    .custom(async (value: number, { req }) => {
      const fecha_inicio = new Date(req.body.fecha_inicio)
      const dias = diasRestantes(fecha_inicio)

      if (value > dias) {
        throw new Error(`Los dias deben de ser menores o iguales a ${dias}`)
      }

      return true
    }),
  check('fecha_inicio')
    .notEmpty().withMessage('Es obligatorio el campo fecha_inicio')
    .custom(async (value, { req }) => {
      const { id_cia, id_emp } = req.user
      const diasIncidencia = req.body.dias_incidencia
      const fechaInicio = new Date(value)
      const fechaFin = new Date(fechaInicio)
      fechaFin.setDate(fechaInicio.getDate() + Number(diasIncidencia))

      // Arreglo de fechas entre el rango de fechas (no contienen hora)
      const fechas = fechasSinHora(obtenerFechasEntreRango(fechaInicio, fechaFin))

      const finder = new JustificantesService()

      // * Validar que la fecha no coincida en un periodo cerrado
      const periodosCerrados = await AppDataSource.query(`
      SELECT fecha FROM CalenNomina cn 
          INNER JOIN (
            SELECT fecha FROM DetalleCalendarios WHERE YEAR(fecha) IN (@1) OR YEAR(fecha) IN (@2) GROUP BY fecha
          ) dc ON dc.fecha BETWEEN cn.FechaIni AND cn.FechaFin 
        WHERE cn.Id_cia = @0 AND cn.parcial = 0 AND cn.actualizado = 1 ORDER BY fecha
      `, [id_cia, fechaInicio.getFullYear(), fechaFin.getFullYear()])

      periodosCerrados.forEach(periodo => {
        periodo.fecha = fechaSinHora(periodo.fecha)
      })

      fechas.forEach(fecha => {
        periodosCerrados.forEach(periodo => {
          if (fecha.getTime() === new Date(periodo.fecha).getTime()) throw new Error('Hay una fecha en el rango que ya ha sido registrada en un periodo cerrado. Verifique')
        })
      })

      // * Validar que no existan incidencias o incapacidades registradas en el periodo solicitado
      const incidencias = await finder.findHistorialIncidencias(id_emp, value)
      const incapacidades = await finder.findHistorialIncapacidades(id_emp, value)

      if (fechas.some(fecha => incidencias.some(incidencia => incidencia.fecha.getTime() === fecha.getTime()))) {
        throw new Error('Ya existe una incidencia en el rango de la solicitud. Favor de acudir directamente a su departamento de personal')
      }
      if (fechas.some(fecha => incapacidades.some(incapacidad => incapacidad.fecha.getTime() === fecha.getTime()))) {
        throw new Error('Ya existe una incapacidad en el rango de la solicitud. Favor de acudir directamente a su departamento de personal')
      }

      // * Validar que no exista una solicitud en un mismo periodo ya registrado
      // ? Obtener todos los justificantes
      const justificantes = await finder.findAll(id_emp)

      // ? Obtener las fechas que tienen los justificantes
      // ? Filtra los justificantes que tienen de estatus el valor de 1 (Enviada) o la descripcion 'Autorizada'
      const fechasNoDisponibles =
      justificantes
        .filter(justificante => (justificante.nivel.id_estatus === 1 || justificante.nivel.descripcion === 'Autorizada'))
        // ? De estos justificantes, obtener el rango de fechas
        .map((justificante) => {
          const fechaInicio = new Date(justificante.fecha_inicio)
          const fechaFin = new Date(fechaInicio)
          fechaFin.setDate(fechaInicio.getDate() + justificante.dias_incidencia)

          return fechasSinHora(obtenerFechasEntreRango(fechaInicio, fechaFin))
        })

      // ? De las fechas que se quieren solicitar, verificar que no existan en las fechas de los justificantes
      fechas.forEach(fechaSolicitud => {
        fechasNoDisponibles.forEach(fechaDatabase => {
          fechaDatabase.forEach(fechaNoDisponible => {
            if (fechaSolicitud.getTime() === fechaNoDisponible.getTime()) throw new Error('Hay una fecha en el rango, que ya ha sido registrada en otra solicitud. Verifique')
          })
        })
      })
    }),
  bodyValidator]

export const updateValidators = [bodyValidator]
