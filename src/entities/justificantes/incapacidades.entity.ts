import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Justificantes } from './justificantes.entity'

/* Incapacidades */
@Entity('TRazInc')
export class Incapacidades extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_razInc: number

  @Column()
    razInc: string

  @Column()
    descr: string

  @Column()
    autoservicio: string

  @Column()
    evidencia: string

  @OneToMany(() => Justificantes, justificante => justificante.incapacidad)
    justificante: Justificantes
}
