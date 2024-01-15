import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Cardex } from '../cardex.entity'
import { Registro } from './registro.entity'

@Entity('TiempoxDia')
export class Tiempos extends BaseEntity {
  @PrimaryColumn()
    idEmpleado: number

  @PrimaryColumn()
    fecha: string

  @Column()
    tiempoNormal: string

  @Column()
    tiempoExtra: string

  @Column()
    tExtraAut: string

  @Column()
    tAusente: string

  @ManyToOne(() => Cardex, cardex => cardex.tiempos)
  @JoinColumn({ name: 'idEmpleado', referencedColumnName: 'id_emp' })
    cardex: Cardex

  @OneToMany(() => Registro, registro => registro.tiempos)
    registro: Registro[]
}
