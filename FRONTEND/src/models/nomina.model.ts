export interface Nomina {
  supervisor: Supervisor
  metodoPago: MetodoPago
  banco: Banco
  horario: Horario
  turno: Turno
  area: Area
  categoria: Categoria
  centroCosto: CentroCosto
  departamento: Departamento
  linea: Linea
  planta: Planta
  manoObra: ManoObra
  contacto: Contacto
}

export interface Supervisor {
  id_supervisor: number
  id_empleado: number
  id_cia: number
  nombr: string
  super: string
}

export interface MetodoPago {
  id_medioPago: number
  descripcion: string
}

export interface Banco {
  id_banco: number
  banco: string
  descr: string
}

export interface Horario {
  id_horario: number
  id_turno: number
  horario: string
}

export interface Turno {
  id_turno: number
  turno: string
}

export interface Area {
  id_areas: number
  cveArea: string
  desArea: string
}

export interface Categoria {
  id_categorias: number
  categ: string
  desCat: string
}

export interface CentroCosto {
  id_cCosto: number
  cCosto: string
  descr: string
}

export interface Departamento {
  id_departamentos: number
  depto: string
  descr: string
}

export interface Linea {
  id_lineas: number
  linea: string
  descr: string
}

export interface ManoObra {
  id_tipoMO: number
  tipoMO: string
  descripcion: string
}

export interface Planta {
  id_plantas: number
  cvePlanta: string
  desPlanta: string
}

export interface Contacto {
  id_parentesco: number
  nombre: string
  apPaterno: string
  apMaterno: string
  telefonoE: string
  celular: string
}

interface TipoSalario {
  [key: string]: string
  M: string
  F: string
  V: string
}

export const TiposSalarios: TipoSalario = {
  M: 'Mixto',
  F: 'Fijo',
  V: 'Variable'
}
