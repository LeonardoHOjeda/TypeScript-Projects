import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Justificantes } from './justificantes.entity'

/* Incidencias */
@Entity('TRazFal')
export class Incidencias extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_razFal: number

  @Column()
    razFal: string

  @Column()
    descr: string

  @Column()
    autoservicio: string

  @Column()
    evidencia: string

  @OneToMany(() => Justificantes, justificante => justificante.incidencia)
    justificante: Justificantes
}

@Entity('HFaltasInd')
export class HIncidencias extends BaseEntity {
  @PrimaryColumn()
    id_emp: number

  @Column()
    diasc: number

  @Column()
    fecha: Date
}
