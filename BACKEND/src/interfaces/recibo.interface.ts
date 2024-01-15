export interface Recibo {
  empleado: Empleado[]
  empresa: Empresa[]
  percepciones: Percepcion[]
  deducciones: Deduccion[]
  registroPatronal: RegistroPatronal[]
  tiempos: Tiempo[]
  vacaciones: Vacaciones[]
}

export interface Deduccion {
  id_concepto: number
  horas: number
  descripcion: string
  cantidad: string
  saldoAnterior: null
  importe: string
  saldoActual: null
  pesos: number | string
  pesosExcento: number | string
}

export interface Empleado {
  noempx: string
  nombre: string
  apPaterno: string
  apMaterno: string
  imss: string
  fecha_alta: Date | string
  id_emp: number
  rfc: string
  curp: string
  linea: string
  departamento: string
  area: string
  turno: string
  horario: string
  periodo: number
  sd: number | string
  sdi: number
  id_plaza: number
  banco: string
  medioPago: string
  cuenta: string
  puesto: string
  periodoPago: string
}

export interface Empresa {
  id_razonsocial: number
  razonSocial: string
  rfc: string
  id_imagen: number
  domicilio: string
  colonia: string
  codigoPostal: string
  ciudad: string
  estado: string
}

export interface Percepcion {
  clave: number
  concepto: string
  horas: number
  pesos: number | string
  excento: number | string
  total: number | string
  totaliza: boolean
}

export interface RegistroPatronal {
  id_regPat: number
  regPat: string
}

export interface Tiempo {
  fecha: Date
  tiempoNormal: Date
  tiempoExtra: Date
  tExtraAut: Date
  tAusente: Date
  cardex: Cardex
  entrada: null
  salida: null
}

export interface Cardex {
  id_emp: number
  acardex: string
  diasa: string
}

export interface Vacaciones {
  resultado: null
}

export interface AportacionEmpleado {
  aportEmpleado: number
}

export interface ConfiguracionRecibo {
  fdoAhrcbo: boolean
  fdoAhrcboEmpresa: boolean
  periodoActualFA: boolean
}
