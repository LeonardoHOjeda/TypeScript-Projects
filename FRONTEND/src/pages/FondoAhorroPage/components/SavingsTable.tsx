import { useState } from 'react'
import { AhorrosModel } from '../../../models/AhorrosModel'
import { customStyles, formatDefaultDate, formatMoney, paginationOptions } from '../../../utils/helpers'
import DataTable, { TableColumn } from 'react-data-table-component'
import { GridValidRowModel } from '@mui/x-data-grid'
import { Icon } from '../../../utils/Icon'
import { faEraser } from '@fortawesome/free-solid-svg-icons'

interface DataRow {
  año: string
  numero: string
  parcial: string
  fechaini: string
  fechafin: string
  fondoEmp: string
  fondoCia: string
}

export const SavingsTable = ({ savingsData }: { savingsData: AhorrosModel[] }) => {
  const data = savingsData

  const [filterYear, setFilterYear] = useState('')
  const [filterPeriod, setFilterPeriod] = useState('')
  const [filterPartial, setFilterPartial] = useState('')

  const filterData = () => {
    return data?.filter((item: any) => {
      const yearMatch = (item.año ?? '').toString().includes(filterYear)
      const periodMatch = (item.numero ?? '').toString().includes(filterPeriod)
      const partialMatch = (item.parcial ?? '').toString().includes(filterPartial)

      return yearMatch && periodMatch && partialMatch
    })
  }

  const columns: Array<TableColumn<DataRow | GridValidRowModel>> = [
    {
      name: <div className='text-center'>Año</div>,
      selector: (row) => row.año,
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Periodo</div>,
      selector: (row) => row.numero,
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Parcial</div>,
      selector: (row) => row.parcial,
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Fecha Inicial</div>,
      selector: (row) => formatDefaultDate(row.fechaini),
      center: true,
      sortable: true,
      minWidth: '150px'
    },
    {
      name: <div className='text-center'>Fecha Final</div>,
      selector: (row) => formatDefaultDate(row.fechafin),
      center: true,
      sortable: true,
      minWidth: '150px'
    },
    {
      name: <div className='text-center'>Fondo de Ahorro del Empleado</div>,
      selector: (row) => formatMoney(row.fondoEmp),
      center: true,
      sortable: true,
      minWidth: '250px'
    },
    {
      name: <div className='text-center'>Fondo de Ahorro de la Empresa</div>,
      selector: (row) => formatMoney(row.fondoCia),
      center: true,
      sortable: true,
      minWidth: '250px'
    }
  ]

  const subHeading = (
    <div className='flex flex-col md:flex-row w-full gap-2'>
      <input
        type="text"
        placeholder="Buscar por año"
        value={filterYear}
        onChange={(e) => setFilterYear(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 md:w-36"
      />
      <input
        type="text"
        placeholder="Buscar por periodo"
        value={filterPeriod}
        onChange={(e) => setFilterPeriod(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 md:w-36"
      />
      <input
        type="text"
        placeholder="Buscar por parcial"
        value={filterPartial}
        onChange={(e) => setFilterPartial(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 md:w-36"
      />
      <button
        onClick={() => {
          setFilterYear('')
          setFilterPeriod('')
          setFilterPartial('')
        }}
        disabled={!filterYear && !filterPeriod && !filterPartial}
        className={`text-white border-secondary bg-secondary   focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center ${(!filterYear && !filterPeriod && !filterPartial) ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:border-blue-800 hover:bg-blue-800'}`}
      >
        <div className='flex justify-center'>
        <span className='mr-2 uppercase font-bold'>Limpiar filtros</span>
          <Icon css='icon' icon={faEraser} />
        </div>
      </button>

    </div>
  )

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <DataTable
        columns={columns}
        dense={true}
        customStyles={customStyles}
        data={filterData()}
        fixedHeader
        noDataComponent="No hay información para mostrar"
        pagination
        paginationComponentOptions={paginationOptions}
        responsive={true}
        striped
        subHeader={true}
        subHeaderComponent={subHeading}
      />
    </div>
  )
}
