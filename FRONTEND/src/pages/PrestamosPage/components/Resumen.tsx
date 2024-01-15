import { PrestamosTabla, Desglose } from '../../../models/prestamos.model'
import { formatMoney } from '../../../utils/helpers'

export const Resumen = ({ loanData }: { loanData: any }) => {
  function sumarValores (arreglo: PrestamosTabla[]) {
    return arreglo.reduce(
      (accum: PrestamosTabla, prestamo: Desglose) => {
        accum.saldoInicial += Number(prestamo.saldoIncial)
        accum.descuento += Number(prestamo.descuento)
        accum.abonado += Number(prestamo.saldoIncial) - prestamo.saldoActual
        accum.saldoActual += Number(prestamo.saldoActual)

        return accum
      },
      { saldoInicial: 0, descuento: 0, abonado: 0, saldoActual: 0 }
    )
  }

  const resultado = sumarValores(loanData)

  return (
    <div className='flex justify-center'>
      <div className='mt-10 container relative overflow-x-auto content-center md:w-1/2'>
        <table className='w-full text-sm text-left text-gray-500 table-auto border-2 border-red-500 border-collapse'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 text-center'>
            <tr>
              <th className='px-6 py-3'>Total Saldo Inicial </th>
              <th className='px-6 py-3'>Total Descuento</th>
              <th className='px-6 py-3'>Total Abonado</th>
              <th className='px-6 py-3'>Total Saldo Actual</th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white text-center'>
              <th>{formatMoney(resultado.saldoInicial)}</th>
              <th>{formatMoney(resultado.descuento)}</th>
              <th>{formatMoney(resultado.abonado)}</th>
              <th>{formatMoney(resultado.saldoActual)}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
