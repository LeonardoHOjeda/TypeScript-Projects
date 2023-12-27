import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TAreas')
export class TArea extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_areas: number

  @Column()
    cveArea: string

  @Column()
    desArea: string
}

@Entity('HAreas')
export class HArea extends BaseEntity {
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

  @ManyToOne(() => Empleado, (empleado) => empleado.hArea)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TArea)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_areas' })
    area: TArea
}
