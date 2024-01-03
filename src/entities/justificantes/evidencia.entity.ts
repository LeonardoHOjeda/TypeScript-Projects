import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('TEvidencia_Justificaciones')
export class Evidencia extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_evidencia: number

  @Column()
    id_justificacion: number

  @Column()
    referencia_evidencia: string
}
