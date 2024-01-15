export interface Prestamo {
  id_concepto: number
  descripcion: string
}

export interface Desglose {
  id_prestamo: number
  id_concepto: number
  saldoIncial: number
  descuento: number
  saldoActual: number
  concepto: Concepto
}

export interface Concepto {
  id_concepto: number
  descripcion: string
}

export interface PrestamosTabla {
  saldoInicial: number
  descuento: number
  abonado: number
  saldoActual: number
}
