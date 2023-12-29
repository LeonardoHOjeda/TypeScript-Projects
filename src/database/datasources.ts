import { DataSource } from 'typeorm'
import { settings } from '@/config/settings'
import migrations from './migrations'
import { Empleado, Nacionalidad, Estado, Codigos, EstadoCivil, HSupervisor, TSupervisor, RazonSocial, Direccion, Ciudad, Colonia, Contacto } from '@/entities/empleados'
import { Configuracion } from '@/entities/configuracion.entity'
import { HMedioPago, TMedioPago, TBanco, HBanco, HHorario, THorario, TTurno, HTurno, TArea, HArea, TCategoria, HCategoria, TCCosto, HCCosto, TDepartamento, HDepartamento, TLinea, HLinea, TPlanta, HPlanta, TManoObra, HManoObra } from '@/entities/nomina'
import { Cardex, Llaves } from '@/entities/cardex.entity'
import { Concepto, Prestamo } from '@/entities/prestamo.entity'
import { CalendarioNomina, HNomina } from '@/entities/recibo'

const { DB } = settings

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: DB.HOST,
  port: Number(DB.PORT),
  username: DB.USER,
  password: DB.PASSWORD,
  database: DB.NAME,
  synchronize: false,
  logging: false,
  entities: [Empleado, Configuracion, Codigos, RazonSocial, Nacionalidad, Estado, EstadoCivil, TSupervisor, HSupervisor, HMedioPago, TMedioPago, TBanco, HBanco, THorario, HHorario, TTurno, HTurno, TArea, HArea, TCategoria, HCategoria, TCCosto, HCCosto, TDepartamento, HDepartamento, TLinea, HLinea, TPlanta, HPlanta, TManoObra, HManoObra, Direccion, Ciudad, Colonia, Contacto, Cardex, Llaves, Concepto, Prestamo, CalendarioNomina, HNomina],
  migrations,
  extra: {
    trustServerCertificate: true
  }
})
