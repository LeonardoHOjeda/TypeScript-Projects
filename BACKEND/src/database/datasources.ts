import { DataSource } from 'typeorm'
import { settings } from '@/config/settings'
import migrations from './migrations'
import { Empleado, Nacionalidad, Estado, Codigos, EstadoCivil, HSupervisor, TSupervisor, RazonSocial, Direccion, Ciudad, Colonia, Contacto, RegistroPatronal, Foto, Repositorio } from '@/entities/empleados'
import { Configuracion } from '@/entities/configuracion.entity'
import { HMedioPago, TMedioPago, TBanco, HBanco, HHorario, THorario, TTurno, HTurno, TArea, HArea, TCategoria, HCategoria, TCCosto, HCCosto, TDepartamento, HDepartamento, TLinea, HLinea, TPlanta, HPlanta, TManoObra, HManoObra } from '@/entities/nomina'
import { Cardex, Llaves } from '@/entities/cardex.entity'
import { Concepto, Prestamo } from '@/entities/prestamo.entity'
import { CalendarioNomina, HNomina, Imagen, Timbrado, Concepto as ConceptoRecibo } from '@/entities/recibo'
import { Registro, Tiempos } from '@/entities/tiempos'
import { FondoAhorro } from '@/entities/fondo_ahorro.entity'
import { Conceptos, ConfigConceptos } from '@/entities/conceptos.entity'
import { Bitacora, Evidencia, HIncapacidades, HIncidencias, Incapacidades, Incidencias, Justificantes, NivelesEstatus, Tenant } from '@/entities/justificantes'
import { Usuario } from '@/entities/usuario.entity'

const { DB, REPOSITORY } = settings

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: DB.HOST,
  port: Number(DB.PORT),
  username: DB.USER,
  password: DB.PASSWORD,
  database: DB.NAME,
  synchronize: false,
  logging: false,
  entities: [Empleado, Configuracion, Codigos, RazonSocial, Nacionalidad, Estado, EstadoCivil, TSupervisor, HSupervisor, HMedioPago, TMedioPago, TBanco, HBanco, THorario, HHorario, TTurno, HTurno, TArea, HArea, TCategoria, HCategoria, TCCosto, HCCosto, TDepartamento, HDepartamento, TLinea, HLinea, TPlanta, HPlanta, TManoObra, HManoObra, Direccion, Ciudad, Colonia, Contacto, Cardex, Llaves, Concepto, Prestamo, CalendarioNomina, HNomina, RegistroPatronal, Tiempos, Registro, FondoAhorro, ConfigConceptos, Conceptos, Incidencias, Incapacidades, NivelesEstatus, Justificantes, Usuario, Bitacora, Evidencia, Tenant, HIncapacidades, HIncidencias, Foto, Timbrado, ConceptoRecibo],
  migrations,
  extra: {
    trustServerCertificate: true
  }
})

export const ImagenesDataSource = new DataSource({
  type: 'mssql',
  host: REPOSITORY.HOST,
  port: Number(REPOSITORY.PORT),
  username: REPOSITORY.USER,
  password: REPOSITORY.PASSWORD,
  database: REPOSITORY.NAME,
  synchronize: false,
  logging: false,
  entities: [Repositorio, Imagen],
  extra: {
    trustServerCertificate: true
  }
})
