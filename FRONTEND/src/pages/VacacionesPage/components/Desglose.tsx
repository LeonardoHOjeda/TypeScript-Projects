import { GridValidRowModel } from '@mui/x-data-grid'
import { customStyles, formatDefaultDate } from '../../../utils/helpers'
import DataTable, { TableColumn } from 'react-data-table-component'

interface DataRow {
  noEmpx: string
  nombre: string
  fechaAlta: string
  antiguedad: string
  diasGanados: string
  diasPagados: string
  ajuste: string
  saldoDiasPorPagar: string
  razonAjuste: string
}

export const Desglose = ({ vacaciones }: { vacaciones: GridValidRowModel[] }) => {
  const lastRowIndex = vacaciones.length - 1
  const lastRow = vacaciones[lastRowIndex]

  const datos = vacaciones

  const columnas: Array<TableColumn<DataRow | GridValidRowModel>> = [
    {
      name: <div className='text-center'>Fecha Alta</div>,
      selector: row => formatDefaultDate(row.fechaAlta),
      center: true,
      sortable: true,
      minWidth: '120px'
    },
    {
      name: <div className='text-center'>Antigüedad</div>,
      selector: row => {
        const isLastRow = row.antiguedad === lastRow.antiguedad
        const asterisk = isLastRow ? '*' : ''
        return `${row.antiguedad}${asterisk}`
      },
      center: true,
      sortable: true,
      minWidth: '160px'
    },
    {
      name: <div className='text-center'>D. Ganados</div>,
      selector: row => row.diasGanados,
      center: true,
      sortable: true,
      minWidth: '130px'
    },
    {
      name: <div className='text-center'>D. Pagados</div>,
      selector: row => row.diasPagados,
      center: true,
      sortable: true,
      minWidth: '130px'
    },
    {
      name: <div className='text-center'>Ajuste</div>,
      selector: row => row.ajuste,
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>D.x Pagar</div>,
      selector: row => row.saldoDiasPorPagar,
      center: true,
      sortable: true,
      minWidth: '120px'
    },
    {
      name: <div className='text-center'>Razón Ajuste</div>,
      selector: row => row.razonAjuste,
      center: true,
      sortable: true,
      minWidth: '150px'
    }
  ]

  return (
    <div>
      <DataTable
        columns={columnas}
        dense={true}
        customStyles={customStyles}
        data={datos}
        fixedHeader
        responsive={true}
        striped
      />
    </div>
  )
}
