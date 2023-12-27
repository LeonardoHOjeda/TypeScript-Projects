import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TCCosto')
export class TCCosto extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_cCosto: number

  @Column()
    cCosto: string

  @Column()
    descr: string
}

@Entity('HCCosto')
export class HCCosto extends BaseEntity {
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

  @ManyToOne(() => Empleado, (empleado) => empleado.hccosto)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TCCosto)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_cCosto' })
    centro_costo: TCCosto
}
