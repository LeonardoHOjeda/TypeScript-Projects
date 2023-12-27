import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Codigos } from './codigos.entity'
import { Nacionalidad } from './nacionalidad.entity'
import { Direccion, Estado } from './direccion.entity'
import { EstadoCivil } from './estado_civil.entity'
import { HSupervisor } from './supervisor.entity'
import { Contacto } from './contacto.entity'
import { HMedioPago, HBanco, HHorario, HTurno, HArea, HCategoria, HCCosto, HDepartamento, HLinea, HPlanta, HManoObra } from '../nomina'

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
    email: string

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
    fecha_alta: string

  @Column()
    fechaPerPrueba: string

  @Column()
    fechaTerContrato: string

  @Column()
    fechaRevContrato: string

  @Column()
    gpo_imss: string

  @Column()
    cuenta_invernomina: string

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
    id_direccion: number

  @Column()
    edoCivil: string

  @OneToOne(() => Codigos, codigo => codigo.empleado)
    codigo: Codigos

  @OneToOne(() => Contacto, contacto => contacto.empleado)
    contacto: Contacto

  @OneToMany(() => HSupervisor, (hsupervisor) => hsupervisor.empleado)
    hSupervisor: HSupervisor[]

  @OneToMany(() => HMedioPago, (hmediopago) => hmediopago.empleado)
    hMedioPago: HMedioPago[]

  @OneToMany(() => HBanco, (hbanco) => hbanco.empleado)
    hBanco: HBanco[]

  @OneToMany(() => HHorario, (hhorario) => hhorario.empleado)
    hHorario: HHorario[]

  @OneToMany(() => HTurno, (hturno) => hturno.empleado)
    hTurno: HTurno[]

  @OneToMany(() => HArea, (harea) => harea.empleado)
    hArea: HArea[]

  @OneToMany(() => HCategoria, (hcategoria) => hcategoria.empleado)
    hCategoria: HCategoria[]

  @OneToMany(() => HCCosto, (hccosto) => hccosto.empleado)
    hCCosto: HCCosto[]

  @OneToMany(() => HDepartamento, (hdepartamento) => hdepartamento.empleado)
    hDepartamento: HDepartamento[]

  @OneToMany(() => HLinea, (hlinea) => hlinea.empleado)
    hLinea: HLinea[]

  @OneToMany(() => HPlanta, (hplanta) => hplanta.empleado)
    hplanta: HPlanta[]

  @OneToMany(() => HManoObra, (hmanoobra) => hmanoobra.empleado)
    hManoObra: HManoObra[]

  @ManyToOne(() => Nacionalidad, nacionalidad => nacionalidad.empleado)
  @JoinColumn({ name: 'id_nacionalidad', referencedColumnName: 'id_nacionalidad' })
    nacionalidad: Nacionalidad

  @ManyToOne(() => Estado, (estado) => estado.empleado)
  @JoinColumn({ name: 'id_estadoNac', referencedColumnName: 'id_estado' })
    estado_nacimiento: Estado

  @ManyToOne(() => EstadoCivil, (estado_civil) => estado_civil.empleado)
  @JoinColumn({ name: 'edoCivil', referencedColumnName: 'clave' })
    estado_civil: EstadoCivil

  @ManyToOne(() => Direccion, (direccion) => direccion.empleado)
  @JoinColumn({ name: 'id_direccion', referencedColumnName: 'id_direccion' })
    direccion: Direccion

  @ManyToOne(() => HSupervisor, (supervisor) => supervisor.id_rel)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_rel' })
    supervisor: HSupervisor
}
