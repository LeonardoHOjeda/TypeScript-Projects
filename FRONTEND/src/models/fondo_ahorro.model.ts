export interface Concepto {
  id_concepto: number
  descripcion: string
}

export interface Ciclos {
  id_cia: number
  fechaCorte: Date
  actualizado: boolean
  comentarios: string
}

export interface Fechas {
  id_cia:      number;
  fechaCorte:  Date;
  actualizado: boolean;
  comentarios: string;
}
