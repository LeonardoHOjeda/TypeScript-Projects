import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from './empleado.entity'

@Entity('CNNombres')
export class Contacto extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_nombre: number

  @Column()
    id_emp: number

  @Column()
    id_parentesco: number

  @Column()
    nombre: string

  @Column()
    apPaterno: string

  @Column()
    apMaterno: string

  @Column()
    telefonoE: string

  @Column()
    celular: string

  @OneToOne(() => Empleado, (empleado) => empleado.contacto)
    empleado: Empleado
}
