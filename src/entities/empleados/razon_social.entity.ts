import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { Empleado } from './empleado.entity'

@Entity('ConfigRs')
export class RazonSocial extends BaseEntity {
  @PrimaryColumn()
    id_razonsocial: number

  @Column()
    razonSocial: string

  @OneToOne(() => Empleado, empleado => empleado.codigo)
  @JoinColumn({ name: 'idEmpleado', referencedColumnName: 'id_emp' })
    empleado: Empleado
}
