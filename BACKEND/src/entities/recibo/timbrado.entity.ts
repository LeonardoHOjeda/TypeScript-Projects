import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('timbrado_empleado')
export class Timbrado extends BaseEntity {
  @PrimaryGeneratedColumn()
    uuid_timbrado: string

  @Column()
    comprobante_folio: string

  @Column()
    regimen_fiscal: string

  @Column()
    imagenQrCode: Buffer

  @Column()
    id_emp: number

  @Column()
    id_periodo: number

  @Column()
    fecha_timbrado: string

  @Column()
    noCertificado: string

  @Column()
    noCertificadoSAT: string

  @Column()
    sello_cfd: string

  @Column()
    sello_sat: string

  @Column()
    cadenaorigenal_timbresat: string
}
