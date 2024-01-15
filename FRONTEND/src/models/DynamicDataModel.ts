export interface DynamicDataModel {
  CVEAREA: string
  DESAREA: string
  categoria: CategoriaModel
  centroCosto: CentroCostoModel
  departamento: DepartamentoModel
  linea: LineaModel
  planta: PlantaModel
  manoObra: ManoObraModel
}

interface CategoriaModel {
  Id_Categorias: number
  CATEG: string
  DESCAT: string
}

interface CentroCostoModel {
  CCosto: string
  Descr: string
}

interface DepartamentoModel {
  Depto: string
  DESCR: string
}

interface LineaModel {
  Linea: string
  DESCR: string
}

interface PlantaModel {
  CVEPLANTA: string
  DESPLANTA: string
}

interface ManoObraModel {
  TipoMO: string
  Descripcion: string
}
