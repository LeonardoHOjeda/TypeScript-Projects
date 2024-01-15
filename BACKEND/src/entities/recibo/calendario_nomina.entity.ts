import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { HNomina } from './nomina.entity'

@Entity('CalenNomina')
export class CalendarioNomina extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_periodo: number

  @Column()
    año: string

  @Column()
    leyenda1: string

  @Column()
    leyenda2: string

  @OneToMany(() => HNomina, nomina => nomina.calendario)
    nominas: HNomina[]
}
