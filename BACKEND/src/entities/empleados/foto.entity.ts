import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('X_EMPLEADOS_FOTO')
export class Repositorio extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_campo: number

  @Column()
    guid: string

  @Column()
    xfile: string
}

@Entity('CD_Empleado')
export class Foto extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_emp: number

  @Column()
    foto: number
}
