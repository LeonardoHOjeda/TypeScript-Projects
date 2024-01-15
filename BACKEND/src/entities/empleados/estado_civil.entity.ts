import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from './empleado.entity'

@Entity('TEstadoCivil')
export class EstadoCivil extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_estadoCivil: number

  @Column({ select: false })
    clave: string

  @Column()
    descripcion: string

  @OneToMany(() => Empleado, (empleado) => empleado.edoCivil)
    empleado: Empleado[]
}
