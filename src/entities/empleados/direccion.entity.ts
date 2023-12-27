import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from './empleado.entity'

@Entity('TEstados')
export class Estado extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_estado: number

  @Column()
    descr: string

  @OneToMany(() => Empleado, (empleado) => empleado.id_estadoNac)
    empleado: Empleado[]

  @OneToMany(() => Direccion, (direccion) => direccion.id_estado)
    direccion: Direccion[]
}

@Entity('TCiudad')
export class Ciudad extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_ciudad: number

  @Column()
    ciudad: string

  @Column({ select: false })
    id_estado: number

  @Column()
    descr: string

  @OneToMany(() => Direccion, (direccion) => direccion.id_ciudad)
    direccion: Direccion[]
}

@Entity('TColonia')
export class Colonia extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_colonia: number

  @Column()
    colonia: string

  @Column({ select: false })
    id_ciudad: number

  @Column()
    descr: string

  @OneToMany(() => Direccion, (direccion) => direccion.id_colonia)
    direccion: Direccion[]
}

@Entity('TDirecciones')
export class Direccion extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_direccion: number

  @Column()
    calle: string

  @Column()
    numExt: string

  @Column()
    numInt: string

  @Column()
    codPostal: string

  @Column()
    telefono: string

  @Column()
    celular: string

  @Column({ select: false })
    id_estado: number

  @Column({ select: false })
    id_ciudad: number

  @Column({ select: false })
    id_colonia: number

  @OneToMany(() => Empleado, (empleado) => empleado.id_direccion)
    empleado: Empleado[]

  @ManyToOne(() => Estado, (estado) => estado.direccion)
  @JoinColumn({ name: 'id_estado', referencedColumnName: 'id_estado' })
    estado: Estado

  @ManyToOne(() => Ciudad, (ciudad) => ciudad.direccion)
  @JoinColumn({ name: 'id_ciudad', referencedColumnName: 'id_ciudad' })
    ciudad: Ciudad

  @ManyToOne(() => Colonia, (colonia) => colonia.direccion)
  @JoinColumn({ name: 'id_colonia', referencedColumnName: 'id_colonia' })
    colonia: Colonia
}
