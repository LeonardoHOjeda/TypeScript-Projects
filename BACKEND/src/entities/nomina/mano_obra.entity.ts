import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TTipoMO')
export class TManoObra extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_tipoMO: number

  @Column()
    tipoMO: string

  @Column()
    descripcion: string
}

@Entity('HTipoMO')
export class HManoObra extends BaseEntity {
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

  @ManyToOne(() => Empleado, (empleado) => empleado.hManoObra)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TManoObra)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_tipoMO' })
    manoObra: TManoObra
}
