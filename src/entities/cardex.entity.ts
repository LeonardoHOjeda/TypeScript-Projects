import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('CardexxEmp')
export class Cardex extends BaseEntity {
  @PrimaryColumn()
    id_emp: number

  @Column()
    acardex: string

  @Column()
    diasa: string
}

@Entity('TClaCardex')
export class Llaves extends BaseEntity {
  @PrimaryGeneratedColumn()
    id_claCardex: number

  @Column()
    clave: string

  @Column()
    color: string

  @Column()
    descr: string
}
