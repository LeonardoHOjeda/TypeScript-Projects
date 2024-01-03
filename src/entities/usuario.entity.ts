import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_usuario: number

  @Column()
    usuario: string

  @Column()
    id_emp: number
}
