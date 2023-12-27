import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TBancos')
export class TBanco extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_banco: number

  @Column()
    banco: string

  @Column()
    descr: string
}

@Entity('hbancos')
export class HBanco extends BaseEntity {
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

  @ManyToOne(() => Empleado, (empleado) => empleado.hBanco)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TBanco)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_banco' })
    banco: TBanco
}
