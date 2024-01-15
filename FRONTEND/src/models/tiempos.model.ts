export interface Tiempos {
  fecha: string
  tiempoNormal: string
  tiempoExtra: string
  tExtraAut: string
  tAusente: string
  cardex: Cardex
  entrada: Movimiento | null
  salida: Movimiento | null
}

export interface Cardex {
  id_emp: number
  acardex: string
  diasa: string
}

export interface Movimiento {
  idRegistro: number
  idEmpleado: number
  fechaHora: string
  fechaDia: string
  movi: number
}
