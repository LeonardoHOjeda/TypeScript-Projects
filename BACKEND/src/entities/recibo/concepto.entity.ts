import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Conceptos')
export class Concepto extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_concepto: number

  @Column()
    descripcion: string
}
