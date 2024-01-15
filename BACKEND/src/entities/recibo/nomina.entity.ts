import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CalendarioNomina } from './calendario_nomina.entity'

@Entity('Nom_histpagos')
export class HNomina extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_emp: number

  @Column()
    id_periodo: number

  @ManyToOne(() => CalendarioNomina, calendario => calendario.nominas)
  @JoinColumn({ name: 'id_periodo', referencedColumnName: 'id_periodo' })
    calendario: CalendarioNomina
}
