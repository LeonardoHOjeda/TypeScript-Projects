import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TLineas')
export class TLinea extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_lineas: number

  @Column()
    linea: string

  @Column()
    descr: string
}

@Entity('HLineas')
export class HLinea extends BaseEntity {
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

  @ManyToOne(() => Empleado, (empleado) => empleado.hLinea)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TLinea)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_lineas' })
    linea: TLinea
}
