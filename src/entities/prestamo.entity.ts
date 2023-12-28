import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Conceptos')
export class Concepto extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_concepto: number

  @Column()
    descripcion: string

  @OneToMany(() => Prestamo, prestamo => prestamo.id_concepto)
    prestamos: Prestamo[]
}

@Entity('DeducsFijas')
export class Prestamo extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_prestamo: number

  @Column()
    id_emp: number

  @Column()
    status: string

  @Column()
    id_concepto: string

  @ManyToOne(() => Concepto, concepto => concepto.prestamos)
  @JoinColumn({ name: 'id_concepto', referencedColumnName: 'id_concepto' })
    concepto: Concepto
}
