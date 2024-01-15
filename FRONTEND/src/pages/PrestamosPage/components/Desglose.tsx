import { GridValidRowModel } from '@mui/x-data-grid'
import { calculateSaldoClass, customStyles, formatMoney, paginationOptions } from '../../../utils/helpers'
import DataTable, { TableColumn } from 'react-data-table-component'
import { Desglose as DesgloseModel } from '../../../models/prestamos.model'

export const Desglose = ({ loanData }: { loanData: GridValidRowModel[] }) => {
  const columns: Array<TableColumn<DesgloseModel>> = [
    {
      name: <div className='text-center'>Prestamo</div>,
      selector: (row) => row.id_prestamo,
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Saldo Inicial</div>,
      selector: (row) => formatMoney(row.saldoIncial),
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Descuento</div>,
      selector: (row) => formatMoney(row.descuento),
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Abonado</div>,
      selector: (row) => formatMoney(Number(row.saldoIncial - row.saldoActual)),
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Saldo Actual</div>,
      selector: (row) => formatMoney(row.saldoActual),
      style: (row: any) => ({
        color: calculateSaldoClass(row.saldoIncial, row.saldoActual)
      }),
      center: true,
      sortable: true
    }
  ]

  return (
    <div>
      <DataTable
        columns={columns}
        data={loanData}
        customStyles={customStyles}
        fixedHeader
        noDataComponent="No hay información para mostrar"
        dense={true}
        pagination
        paginationComponentOptions={paginationOptions}
        responsive={true}
        striped
      />
    </div>
  )
}
