import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TMedioPago')
export class TMedioPago extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_medioPago: number

  @Column()
    descripcion: string
}

@Entity('hmediopago')
export class HMedioPago extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_emp: number

  @Column()
    id_rel: number

  @Column()
    fecha: string

  @Column()
    id_user: number

  @Column()
    movimiento: string

  @ManyToOne(() => Empleado, (empleado) => empleado.hMedioPago)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TMedioPago)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_medioPago' })
    medioPago: TMedioPago
}
