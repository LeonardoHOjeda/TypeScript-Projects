
export const HolidayTotalTable = ({ holidayData }: { holidayData: any }) => {
  function sumarValores (arreglo: any) {
    const sumaDiasGanados = arreglo.reduce((total: number, objeto: any) => total + Number(objeto.diasGanados), 0)
    const sumaDiasPagados = arreglo.reduce((total: number, objeto: any) => total + Number(objeto.diasPagados), 0)
    const sumaAjuste = arreglo.reduce((total: number, objeto: any) => total + Number(objeto.ajuste), 0)
    const sumaSaldoDiasPorPagar = arreglo.reduce((total: number, objeto: any) => total + Number(objeto.saldoDiasPorPagar), 0)
    return { sumaDiasGanados, sumaDiasPagados, sumaAjuste, sumaSaldoDiasPorPagar }
  }

  const { sumaDiasGanados, sumaDiasPagados, sumaAjuste, sumaSaldoDiasPorPagar } = sumarValores(holidayData)

  return (
    <div className='flex justify-center'>
      <div className='mt-10 container relative overflow-x-auto content-center md:w-2/3'>
        <table className='w-full text-sm text-left text-gray-500 table-auto border-2 border-red-500 border-collapse'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 text-center'>
            <tr>
              <th className='px-6 py-3'>Total D. Ganados</th>
              <th className='px-6 py-3'>Total D. Pagados</th>
              <th className='px-6 py-3'>Total Ajuste</th>
              <th className='px-6 py-3'>Total D.x Pagar</th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white text-center'>
              <th>{sumaDiasGanados}</th>
              <th>{sumaDiasPagados}</th>
              <th>{sumaAjuste}</th>
              <th>{sumaSaldoDiasPorPagar}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
