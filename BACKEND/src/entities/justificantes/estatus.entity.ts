import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Justificantes } from './justificantes.entity'
import { Bitacora } from './bitacora.entity'
// import { Bitacora } from './bitacora.entity'

/* Estatus */
@Entity('niveles_estatus')
export class NivelesEstatus extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_estatus: number

  @Column()
    nivel: string

  @Column()
    descripcion: string

  @Column()
    etiqueta: string

  @OneToMany(() => Justificantes, justificante => justificante.nivel)
    justificante: Justificantes

  @OneToMany(() => Bitacora, bitacora => bitacora.estatus)
    bitacora: Bitacora
}
