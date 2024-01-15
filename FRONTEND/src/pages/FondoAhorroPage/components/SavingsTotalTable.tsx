import { AhorrosModel } from '../../../models/AhorrosModel'
import { formatMoney } from '../../../utils/helpers'

export const SavingsTotalTable = ({ savingsData }: { savingsData?: AhorrosModel[] }) => {
  function sumarFondos (arreglo: AhorrosModel[]) {
    const sumaFondoCia = arreglo.reduce((total: number, fondo: any) => total + Number(fondo.fondoCia), 0)
    const sumaFondoEmp = arreglo.reduce((total: number, fondo: any) => total + Number(fondo.fondoEmp), 0)

    return { sumaFondoCia, sumaFondoEmp }
  }

  const { sumaFondoCia, sumaFondoEmp } = (savingsData != null) ? sumarFondos(savingsData) : { sumaFondoCia: 0, sumaFondoEmp: 0 }

  return (
    <div className='flex justify-center'>
      <div className='mt-10 container relative overflow-x-auto content-center md:w-1/2'>
        <table className='w-full text-sm text-left text-gray-500 table-auto border-2 border-red-500 border-collapse'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 text-center'>
            <tr>
              <th className='px-6 py-3'>Total Fondo de ahorro del Empleado: </th>
              <th className='px-6 py-3'>Total Fondo de ahorro de la Empresa:</th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white text-center'>
              <th>{formatMoney(sumaFondoEmp)}</th>
              <th>{formatMoney(sumaFondoCia)}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
