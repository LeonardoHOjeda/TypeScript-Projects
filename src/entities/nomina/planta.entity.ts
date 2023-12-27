import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TPlantas')
export class TPlanta extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_plantas: number

  @Column()
    cvePlanta: string

  @Column()
    desPlanta: string
}

@Entity('HPlantas')
export class HPlanta extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_emp: number

  @Column()
    id_rel: string

  @Column()
    fecha: string

  @Column()
    id_user: number

  @Column()
    movimiento: string

  @ManyToOne(() => Empleado, (empleado) => empleado.hplanta)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TPlanta)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_plantas' })
    planta: TPlanta
}
