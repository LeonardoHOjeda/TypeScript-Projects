import { DataSource } from 'typeorm'
import { settings } from '@/config/settings'
import migrations from './migrations'
import { Empleado, Nacionalidad, Estado, Codigos, EstadoCivil, HSupervisor, TSupervisor, RazonSocial } from '@/entities/empleados'
import { Configuracion } from '@/entities/configuracion.entity'
import { HMedioPago, TMedioPago, TBanco, HBanco, HHorario, THorario } from '@/entities/nomina'
import { HTurno, TTurno } from '@/entities/nomina/turno.entity'
import { HArea, TArea } from '@/entities/nomina/area.entity'
import { HCategoria, TCategoria } from '@/entities/nomina/categoria.entity'

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
  entities: [Empleado, Configuracion, Codigos, RazonSocial, Nacionalidad, Estado, EstadoCivil, TSupervisor, HSupervisor, HMedioPago, TMedioPago, TBanco, HBanco, THorario, HHorario, TTurno, HTurno, TArea, HArea, TCategoria, HCategoria],
  migrations,
  extra: {
    trustServerCertificate: true
  }
})
