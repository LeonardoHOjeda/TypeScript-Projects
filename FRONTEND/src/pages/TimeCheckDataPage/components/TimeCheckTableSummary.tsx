import { Tiempos } from '../../../models/tiempos.model'

export const TimeCheckTableSummary = ({ timeData, schedule }: { timeData: Tiempos[], schedule: any }) => {
  function sumarHoras (arreglo: Tiempos[]) {
    let sumaTiempoNormal = 0
    let sumaTExtraAut = 0
    let sumaTAusente = 0

    arreglo.forEach((objeto: Tiempos) => {
      const sumaHorasTiempoNormal = new Date(objeto.tiempoNormal).getHours()
      const sumaMinutosTiempoNormal = (new Date(objeto.tiempoNormal).getMinutes() / 60)

      const sumaHorasTExtraAut = new Date(objeto.tExtraAut).getHours()
      const sumaMinutosTExtraAut = (new Date(objeto.tExtraAut).getMinutes() / 60)

      const sumaHorasTAusente = new Date(objeto.tAusente).getHours()
      const sumaMinutosTAusente = (new Date(objeto.tAusente).getMinutes() / 60)

      sumaTiempoNormal += sumaHorasTiempoNormal + sumaMinutosTiempoNormal
      sumaTExtraAut += sumaHorasTExtraAut + sumaMinutosTExtraAut
      sumaTAusente += sumaHorasTAusente + sumaMinutosTAusente
    })

    return {
      sumaTExtraAut,
      sumaTiempoNormal,
      sumaTAusente
    }
  }

  function convertirDecimalATiempo (decimal: number): string {
    const horas: number = Math.floor(decimal)
    const minutos: number = Math.floor((decimal * 60) % 60)
    const tiempo = `${horas}:${minutos.toString().padStart(2, '0')}`

    return tiempo
  }

  const { sumaTExtraAut, sumaTiempoNormal, sumaTAusente } = sumarHoras(timeData)

  const tiempoTExtraAut: string = convertirDecimalATiempo(sumaTExtraAut)
  const tiempoTiempoNormal: string = convertirDecimalATiempo(sumaTiempoNormal)
  const tiempoTAusente: string = convertirDecimalATiempo(sumaTAusente)

  return (
    <div className='flex justify-center'>
      <div className='mt-10 container relative overflow-x-auto content-center md:w-1/2'>
        <table className='w-full text-sm text-left text-gray-500 table-auto border-2 border-red-500 border-collapse'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr>
              <th className='px-6 py-3 text-center'>Total TEA: {tiempoTExtraAut}</th>
              <th className='px-6 py-3 text-center'>Total TN: {tiempoTiempoNormal}</th>
              <th className='px-6 py-3 text-center'>Total TA: {tiempoTAusente}</th>
              <th className='px-6 py-3 text-center' colSpan={2}>Total Horas por Periodo: 48:00</th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white text-center'>
              <th colSpan={5}>Horario del empleado: {schedule}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  )
}
