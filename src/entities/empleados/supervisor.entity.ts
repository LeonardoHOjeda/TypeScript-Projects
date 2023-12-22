import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from './empleado.entity'

@Entity('TSupervisor')
export class TSupervisor extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_supervisor: number

  @Column()
    id_empleado: number

  @Column()
    id_cia: number

  @Column()
    nombr: string

  @Column()
    super: string
}

@Entity('HSupervisor')
export class HSupervisor extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_emp: number

  @Column()
    id_rel: number

  @Column()
    fecha: string

  @ManyToOne(() => Empleado, (empleado) => empleado.hSupervisor)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TSupervisor)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_supervisor' })
    supervisor: TSupervisor
}
