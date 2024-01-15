import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TTurnos')
export class TTurno extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_turno: number

  @Column()
    turno: string
}

@Entity('HTurnos')
export class HTurno extends BaseEntity {
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

  @ManyToOne(() => Empleado, (empleado) => empleado.hTurno)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TTurno)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_turno' })
    turno: TTurno
}
