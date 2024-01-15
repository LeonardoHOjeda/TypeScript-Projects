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
    id_concepto: number

  @Column()
    status: string

  @Column({ type: 'float' })
    saldoIncial: number

  @Column({ type: 'float' })
    descuento: number

  @Column({ type: 'float' })
    saldoActual: number

  @ManyToOne(() => Concepto, concepto => concepto.prestamos)
  @JoinColumn({ name: 'id_concepto', referencedColumnName: 'id_concepto' })
    concepto: Concepto
}
