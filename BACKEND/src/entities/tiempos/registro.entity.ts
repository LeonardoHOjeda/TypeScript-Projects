import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Tiempos } from './tiempos.entity'

@Entity('Registro')
export class Registro extends BaseEntity {
  @PrimaryGeneratedColumn()
    idRegistro: number

  @Column()
    idEmpleado: string

  @Column()
    fechaHora: string

  @Column()
    fechaDia: string

  @Column()
    movi: number

  @ManyToOne(() => Tiempos, tiempos => tiempos.registro)
  @JoinColumn([{ name: 'fechaDia', referencedColumnName: 'fecha' }, { name: 'idEmpleado', referencedColumnName: 'idEmpleado' }])
    tiempos: Tiempos
}
