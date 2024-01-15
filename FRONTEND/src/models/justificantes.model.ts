export interface Justificante {
  id_justificacion: number
  id_emp: number
  tipo_solicitud: string
  id_incidencia: number | null
  id_incapacidad: number | null
  fecha_inicio: Date
  dias_incidencia: number
  folio_incidencia: string
  motivo: string
  id_estado_solicitud: number
  id_usuario: number
  origen: string
  fecha_solicitud: Date
  observaciones: null
  incapacidad: Incapacidad | null
  incidencia: Incidencia | null
  nivel: Nivel
}

export interface Incapacidad {
  id_razInc: number
  razInc: string
  descr: string
  autoservicio: string
  evidencia: string
}

export interface Incidencia {
  id_razFal: number
  razFal: string
  descr: string
  autoservicio: string
  evidencia: string
}

export interface Nivel {
  id_estatus: number
  nivel: number
  descripcion: string
  etiqueta: string
}

export interface Bitacora {
  id_estado_solicitud: number
  fecha_aplicacion: Date
  observaciones: string
  justificante: JustificanteBitacora
  estatus: Estatus
}

export interface Estatus {
  id_estatus: number
  nivel: number
  descripcion: string
  etiqueta: string
}

export interface JustificanteBitacora {
  folio_incidencia: string
}
export interface JustificantesTabla {
  id: any
  id_justificacion: number
  id_emp: number
  tipo_solicitud: string
  id_incidencia?: number
  fecha_inicio: string
  file_uuid: string
  dias_incidencia: number
  Folio_incidencia: string
  Motivo: string
  id_estado_solicitud: number
  id_usuario: number
  id_incapacidad?: number
  Fecha_solicitud: string
  Observaciones: string
  Incapacidade?: {
    Id_RazInc: number
    DESCR: string
  }
  Incidencia?: {
    Id_RazFal: number
    DESCR: string
  }
  NivelesEstatus?: {
    id_estatus: number
    descripcion: string
    etiqueta: string
  }
}
