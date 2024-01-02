import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Tiempos } from './tiempos/tiempos.entity'

@Entity('CardexxEmp')
export class Cardex extends BaseEntity {
  @PrimaryColumn()
    id_emp: number

  @Column()
    acardex: string

  @Column()
    diasa: string

  @OneToMany(() => Tiempos, tiempos => tiempos.cardex)
    tiempos: Tiempos[]
}

@Entity('TClaCardex')
export class Llaves extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_claCardex: number

  @Column()
    clave: string

  @Column()
    color: string

  @Column()
    descr: string
}
