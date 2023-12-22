import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Codigos } from './codigos.entity'
import { Nacionalidad } from './nacionalidad.entity'
import { Estado } from './estado.entity'
import { EstadoCivil } from './estado_civil.entity'
import { HSupervisor } from './supervisor.entity'
import { HMedioPago } from '../nomina/metodo_pago.entity'
import { HBanco } from '../nomina/banco.entity'

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

  @Column()
    id_nacionalidad: number

  @Column()
    id_estadoNac: number

  @Column()
    edoCivil: string

  @OneToOne(() => Codigos, codigo => codigo.empleado)
    codigo: Codigos

  @OneToMany(() => HSupervisor, (hsupervisor) => hsupervisor.empleado)
    hSupervisor: HSupervisor[]

  @OneToMany(() => HMedioPago, (hmediopago) => hmediopago.empleado)
    hMedioPago: HMedioPago[]

  @OneToMany(() => HBanco, (hbanco) => hbanco.empleado)
    hbanco: HBanco[]

  @ManyToOne(() => Nacionalidad, nacionalidad => nacionalidad.empleado)
  @JoinColumn({ name: 'id_nacionalidad', referencedColumnName: 'id_nacionalidad' })
    nacionalidad: Nacionalidad

  @ManyToOne(() => Estado, (estado) => estado.empleado)
  @JoinColumn({ name: 'id_estadoNac', referencedColumnName: 'id_estado' })
    estado_nacimiento: Estado

  @ManyToOne(() => EstadoCivil, (estado_civil) => estado_civil.empleado)
  @JoinColumn({ name: 'edoCivil', referencedColumnName: 'clave' })
    estado_civil: EstadoCivil

  @ManyToOne(() => HSupervisor, (supervisor) => supervisor.id_rel)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_rel' })
    supervisor: HSupervisor
}
