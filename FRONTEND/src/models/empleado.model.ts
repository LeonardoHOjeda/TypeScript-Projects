export interface Empleado {
  id_emp: number
  noempx: string
  nombre: string
  apPaterno: string
  apMaterno: string
  email: string
  imss: string
  rfc: string
  curp: string
  sexo: string
  rfcFecha: Date
  lunac: string
  issste: string
  fecha_alta: Date
  fechaPerPrueba: Date
  fechaTerContrato: Date
  fechaRevContrato: null
  gpo_imss: string
  cuenta_invernomina: string
  nip: string
  vigencia: string
  id_cia: number
  id_nacionalidad: number
  id_estadoNac: number
  id_direccion: number
  edoCivil: string
  nacionalidad: Nacionalidad
  estado_nacimiento: Estado
  estado_civil: EstadoCivil
  direccion: Direccion
}

export interface Direccion {
  id_direccion: number
  calle: string
  numExt: string
  numInt: string
  codPostal: number
  telefono: string
  celular: string
  estado: Estado
  ciudad: Ciudad
  colonia: Colonia
}

export interface Ciudad {
  id_ciudad: number
  ciudad: string
  descr: string
}

export interface Colonia {
  id_colonia: number
  colonia: string
  descr: string
}

export interface Estado {
  id_estado: number
  descr: string
}

export interface EstadoCivil {
  id_estadoCivil: number
  descripcion: string
}

export interface Nacionalidad {
  id_nacionalidad: number
  descr: string
}
