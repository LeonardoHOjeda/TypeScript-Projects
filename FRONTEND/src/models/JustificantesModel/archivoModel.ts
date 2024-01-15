export interface Archivo {
  id: number
  uuid: string
  nombreArchivo: string
  awsObjectKey: string
  awsBucket: string
  awsRegion: string
  createdAt: string
  tenantUuid: string
}
