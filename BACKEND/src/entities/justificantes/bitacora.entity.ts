import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Justificantes } from './justificantes.entity'
import { NivelesEstatus } from './estatus.entity'

@Entity('Bitacora_Estatus_justificaciones')
export class Bitacora extends BaseEntity {
  @PrimaryColumn()
    id_justificacion: number

  @Column()
    id_estado_solicitud: number

  @Column()
    fecha_aplicacion: Date

  @Column()
    id_usuario: number

  @Column()
    nivel_autorizacion: number

  @Column()
    fua: Date

  @Column()
    observaciones: string

  @ManyToOne(() => Justificantes)
  @JoinColumn({ name: 'id_justificacion', referencedColumnName: 'id_justificacion' })
    justificante: Justificantes

  @ManyToOne(() => NivelesEstatus)
  @JoinColumn({ name: 'id_estado_solicitud', referencedColumnName: 'id_estatus' })
    estatus: NivelesEstatus[]
}
