import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Empleado } from './empleado.entity'

@Entity('TNacionalidad')
export class Nacionalidad extends BaseEntity {
  @PrimaryColumn()
    id_nacionalidad: number

  @Column()
    descr: string

  @OneToMany(() => Empleado, empleado => empleado.id_nacionalidad)
    empleado: Empleado[]
}
