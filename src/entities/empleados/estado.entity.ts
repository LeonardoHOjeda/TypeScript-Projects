import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from './empleado.entity'

@Entity('tEstadosNac')
export class Estado extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_estado: number

  @Column()
    descr: string

  @OneToMany(() => Empleado, (empleado) => empleado.id_estadoNac)
    empleado: Empleado[]
}
