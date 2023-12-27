import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TDepartamentos')
export class TDepartamento extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_departamentos: number

  @Column()
    depto: string

  @Column()
    descr: string
}

@Entity('HDepartamentos')
export class HDepartamento extends BaseEntity {
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

  @ManyToOne(() => Empleado, (empleado) => empleado.hDepartamento)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TDepartamento)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_departamentos' })
    departamento: TDepartamento
}
