import { DataSource } from 'typeorm'
import { settings } from '@/config/settings'
import migrations from './migrations'
import { Empleado } from '@/entities/empleados'
import { Configuracion } from '@/entities/configuracion.entity'
import { Codigos } from '@/entities/empleados/codigos.entity'
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
  entities: [Empleado, Configuracion, Codigos, RazonSocial],
  migrations,
  extra: {
    trustServerCertificate: true
  }
})
