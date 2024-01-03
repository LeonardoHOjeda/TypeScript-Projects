import { DataSource } from 'typeorm'
import { settings } from '@/config/settings'
import migrations from './migrations'
import { Empleado, Nacionalidad, Estado, Codigos, EstadoCivil, HSupervisor, TSupervisor, RazonSocial, Direccion, Ciudad, Colonia, Contacto, RegistroPatronal } from '@/entities/empleados'
import { Configuracion } from '@/entities/configuracion.entity'
import { HMedioPago, TMedioPago, TBanco, HBanco, HHorario, THorario, TTurno, HTurno, TArea, HArea, TCategoria, HCategoria, TCCosto, HCCosto, TDepartamento, HDepartamento, TLinea, HLinea, TPlanta, HPlanta, TManoObra, HManoObra } from '@/entities/nomina'
import { Cardex, Llaves } from '@/entities/cardex.entity'
import { Concepto, Prestamo } from '@/entities/prestamo.entity'
import { CalendarioNomina, HNomina } from '@/entities/recibo'
import { Registro, Tiempos } from '@/entities/tiempos'
import { FondoAhorro } from '@/entities/fondo_ahorro.entity'
import { Conceptos, ConfigConceptos } from '@/entities/conceptos.entity'
import { Bitacora, Evidencia, Incapacidades, Incidencias, Justificantes, NivelesEstatus } from '@/entities/justificantes'
import { Usuario } from '@/entities/usuario.entity'

const { DB } = settings

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: DB.HOST,
  port: Number(DB.PORT),
  username: DB.USER,
  password: DB.PASSWORD,
  database: DB.NAME,
  synchronize: false,
  logging: true,
  entities: [Empleado, Configuracion, Codigos, RazonSocial, Nacionalidad, Estado, EstadoCivil, TSupervisor, HSupervisor, HMedioPago, TMedioPago, TBanco, HBanco, THorario, HHorario, TTurno, HTurno, TArea, HArea, TCategoria, HCategoria, TCCosto, HCCosto, TDepartamento, HDepartamento, TLinea, HLinea, TPlanta, HPlanta, TManoObra, HManoObra, Direccion, Ciudad, Colonia, Contacto, Cardex, Llaves, Concepto, Prestamo, CalendarioNomina, HNomina, RegistroPatronal, Tiempos, Registro, FondoAhorro, ConfigConceptos, Conceptos, Incidencias, Incapacidades, NivelesEstatus, Justificantes, Usuario, Bitacora, Evidencia],
  migrations,
  extra: {
    trustServerCertificate: true
  }
})
