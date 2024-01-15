/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Tiempos } from '../../../models/tiempos.model'
import { customStyles, formatDefaultDate, getDayPosition, transformTime } from '../../../utils/helpers'
import DataTable, { TableColumn } from 'react-data-table-component'

export const TimeCheckTable = ({ timeData }: { timeData: Tiempos[] }) => {
  const columns: Array<TableColumn<Tiempos>> = [
    {
      name: <div className='text-center'>Fecha</div>,
      selector: row => formatDefaultDate(row.fecha),
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Cardex</div>,
      selector: row => getDayPosition(row.fecha, row.cardex.diasa),
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Entrada</div>,
      selector: row => row.entrada ? transformTime(row.entrada?.fechaHora) : '00:00:00',
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Salida</div>,
      selector: row => row.salida ? transformTime(row.salida?.fechaHora) : '00:00:00',
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Tiempo Normal</div>,
      selector: row => transformTime(row.tiempoNormal),
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Tiempo Ext. Autorizado</div>,
      selector: row => transformTime(row.tExtraAut),
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Tiempo Ausente</div>,
      selector: row => transformTime(row.tAusente),
      center: true,
      sortable: true
    }
  ]

  return (
    <div>
      <DataTable
        columns={columns}
        dense={true}
        customStyles={customStyles}
        data={timeData}
        fixedHeader
        responsive={true}
        striped
      />
    </div>
  )
}
