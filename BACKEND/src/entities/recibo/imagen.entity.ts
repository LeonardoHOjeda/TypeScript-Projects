import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('X_IMAGENES_LOGO_EMPRESAS')
export class Imagen extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_campo: number

  @Column()
    guid: string

  @Column()
    xfile: Buffer
}
