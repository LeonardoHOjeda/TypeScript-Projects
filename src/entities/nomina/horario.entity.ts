import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('THorarios')
export class THorario extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_horario: number

  @Column()
    id_turno: number

  @Column()
    horario: string
}

@Entity('HHorarios')
export class HHorario extends BaseEntity {
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

  @ManyToOne(() => Empleado, (empleado) => empleado.hHorario)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => THorario)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_horario' })
    horario: THorario
}
