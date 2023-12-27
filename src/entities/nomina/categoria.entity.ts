import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Empleado } from '../empleados'

@Entity('TCategorias')
export class TCategoria extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_categorias: number

  @Column()
    categ: number

  @Column()
    desCat: string
}

@Entity('HCategorias')
export class HCategoria extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_emp: number

  @Column()
    id_rel: string

  @Column()
    fecha: string

  @Column()
    id_user: number

  @Column()
    movimiento: string

  @ManyToOne(() => Empleado, (empleado) => empleado.hcategoria)
  @JoinColumn({ name: 'id_emp', referencedColumnName: 'id_emp' })
    empleado: Empleado

  @ManyToOne(() => TCategoria)
  @JoinColumn({ name: 'id_rel', referencedColumnName: 'id_categorias' })
    categoria: TCategoria
}
