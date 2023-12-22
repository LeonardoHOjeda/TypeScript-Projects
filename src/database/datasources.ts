import { DataSource } from 'typeorm'
import { settings } from '@/config/settings'
import migrations from './migrations'
import { Empleado, Nacionalidad, Estado, Codigos, EstadoCivil, HSupervisor, TSupervisor } from '@/entities/empleados'
import { Configuracion } from '@/entities/configuracion.entity'
import { RazonSocial } from '@/entities/empleados/razon_social.entity'

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
  entities: [Empleado, Configuracion, Codigos, RazonSocial, Nacionalidad, Estado, EstadoCivil, TSupervisor, HSupervisor],
  migrations,
  extra: {
    trustServerCertificate: true
  }
})
