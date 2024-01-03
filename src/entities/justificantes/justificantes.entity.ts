import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Incidencias } from './incidencias.entity'
import { Incapacidades } from './incapacidades.entity'
import { NivelesEstatus } from './estatus.entity'

/* Justificantes */
@Entity('TSolicitudes_Avisos_Justificaciones')
export class Justificantes extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_justificacion: number

  @Column()
    id_emp: number

  @Column()
    tipo_solicitud: string

  @Column()
    id_incidencia: number

  @Column()
    id_incapacidad: number

  @Column()
    fecha_inicio: string

  @Column()
    dias_incidencia: number

  @Column()
    folio_incidencia: string

  @Column()
    motivo: string

  @Column()
    id_estado_solicitud: number

  @Column()
    id_usuario: number

  @Column()
    origen: string

  @Column()
    fecha_solicitud: string

  @Column()
    observaciones: string

  @ManyToOne(() => Incidencias, incidencia => incidencia.justificante)
  @JoinColumn({ name: 'id_incidencia', referencedColumnName: 'id_razFal' })
    incidencia?: Incidencias

  @ManyToOne(() => Incapacidades, incapacidad => incapacidad.justificante)
  @JoinColumn({ name: 'id_incapacidad', referencedColumnName: 'id_razInc' })
    incapacidad?: Incapacidades

  @ManyToOne(() => NivelesEstatus, nivel => nivel.justificante)
  @JoinColumn({ name: 'id_estado_solicitud', referencedColumnName: 'id_estatus' })
    nivel: NivelesEstatus
}
