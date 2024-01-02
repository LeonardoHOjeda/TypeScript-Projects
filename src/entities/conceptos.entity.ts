import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('ConfigConceptos')
export class ConfigConceptos extends BaseEntity {
  @PrimaryGeneratedColumn()
    tpoNormal: number

  @Column()
    fa_empleado: number

  @Column()
    fa_cia: number
}

@Entity('Conceptos')
export class Conceptos extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_concepto: number

  @Column()
    descripcion: string
}
