import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Codigos } from './codigos.entity'

@Entity('Empleados')
export class Empleado extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_emp: number

  @PrimaryColumn()
    noempx: string

  @Column()
    nombre: string

  @Column()
    apPaterno: string

  @Column()
    apMaterno: string

  @Column()
    imss: string

  @Column()
    rfc: string

  @Column()
    curp: string

  @Column()
    sexo: string

  @Column()
    rfcFecha: string

  @Column()
    lunac: string

  @Column()
    issste: string

  @Column()
    nip: string

  @Column()
    vigencia: string

  @Column()
    id_cia: number

  @OneToOne(() => Codigos, codigo => codigo.empleado)
    codigo: Codigos
}
