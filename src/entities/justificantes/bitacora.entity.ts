import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { Justificantes } from './justificantes.entity'

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

  @OneToOne(() => Justificantes, justificante => justificante.bitacora)
  @JoinColumn({ name: 'id_justificacion', referencedColumnName: 'id_justificacion' })
    justificante: Justificantes
}
