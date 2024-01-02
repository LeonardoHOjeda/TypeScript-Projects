import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('CorteFondoAhorro')
export class FondoAhorro extends BaseEntity {
  @PrimaryColumn()
    id_cia: number

  @PrimaryColumn()
    fechaCorte: string

  @Column()
    actualizado: boolean

  @Column()
    comentarios: string
}
