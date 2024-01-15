import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from './empleado.entity'

@Entity('ConfigRs')
export class RazonSocial extends BaseEntity {
  @PrimaryColumn()
    id_razonsocial: number

  @Column()
    razonSocial: string

  @Column()
    rfc: string

  @Column()
    id_imagen: number

  @Column()
    domicilio: string

  @Column()
    colonia: string

  @Column()
    codigoPostal: string

  @Column()
    ciudad: string

  @Column()
    estado: string

  @Column()
    cadenaCias: string

  @OneToOne(() => Empleado, empleado => empleado.codigo)
  @JoinColumn({ name: 'idEmpleado', referencedColumnName: 'id_emp' })
    empleado: Empleado
}

@Entity('registro_pat')
export class RegistroPatronal extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_regPat: number

  @Column()
    regPat: string
}
