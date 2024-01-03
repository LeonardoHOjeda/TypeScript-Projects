import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Tenants')
export class Tenant extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    idTenant: string
}
