import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('Config')
export class Configuracion extends BaseEntity {
  @PrimaryColumn()
    accesoKiosko: number

  @Column()
    tipo_captura_justificacion: number

  @Column()
    dias_captura_justificacion: number
}
