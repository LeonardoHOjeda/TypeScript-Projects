export interface EmergencyModel {
  id: number
  idParentesco: number
  nombre: string | null
  apPaterno: string | null
  apMaterno: string | null
  fechaNac: string | null
  porciento: number | null
  matrim: string | null
  sexo: string | null
  telefonoE: string | null
  celular: string | null
  finado: boolean | null
  dependienteEconomico: boolean | null
  hijosEBI: boolean | null
  estudia: number | null
  trabajaGobierno: number | null
  estatus: string | null
  correoElectronico: string | null
  estadoCivil: string | null
  servicios: string | null
  fechaMov: string
}
