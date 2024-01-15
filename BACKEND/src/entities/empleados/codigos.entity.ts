import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { Empleado } from './empleado.entity'

@Entity('EmpleadosCodigos')
export class Codigos extends BaseEntity {
  @PrimaryColumn()
    idCodigo: number

  @Column()
    idEmpleado: number

  @Column()
    codigoGafete: string

  @OneToOne(() => Empleado, empleado => empleado.codigo)
  @JoinColumn({ name: 'idEmpleado', referencedColumnName: 'id_emp' })
    empleado: Empleado
}
