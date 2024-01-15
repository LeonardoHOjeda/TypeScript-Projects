import { Tooltip } from '@mui/material'
import { initMatrix, splitDayByMonth } from '../../../utils/helpers'
import { useMemo } from 'react'
import { Cardex as CardexModel, LlavesCardex } from '../../../models/cardex.model'

export const Cardex = ({ cardexData, llaves }: { cardexData: CardexModel, llaves: LlavesCardex[] }) => {
  /* Variables */
  const dias = Array.from({ length: 31 }, (v, index) => index + 1)
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  /* Funciones */
  const createCalendarData = (year: number, days: string) => {
    const newArray = initMatrix(12, 31)
    const initActualYear = new Date(year, 0, 1)

    for (let index = 0; index < days.length; index++) {
      const dateReference = splitDayByMonth(initActualYear, index)
      if (dateReference.getFullYear() === year) {
        const month = dateReference.getMonth()
        const dayOfMonth = dateReference.getDate() - 1
        newArray[month][dayOfMonth] = days[index]
      }
    }

    return newArray
  }

  const daysTable = useMemo(() => createCalendarData(Number(cardexData.acardex), cardexData.diasa), [cardexData])

  const getDayColor = (key: string) => {
    const llave = llaves.find((color) => color.clave === key)

    return llave?.color ?? 'fff'
  }

  const getKeyDescription = (key: string) => {
    const llave = llaves.find((searchKey) => searchKey.clave === key)

    console.log(llave?.descr)

    return llave?.descr ?? ''
  }

  return (
    <div className="overflow-x-auto px-5">
      <table className='w-full overflow-x text-center text-gray-500 text-xs lg:text-sm table border-collapse md:table-fixed'>
        <thead className='w-auto text-gray-700 bg-green-100'>
          <tr>
            <th scope="col" className="py-3 p-0 m-0 bg-white"></th>
            {dias.map((day) => (
                <th scope="col" className='md:w-1/31 m-0 p-2' key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meses.map((month, index) => (
              <tr className='text-left' style={{ borderTop: '1px solid #e1e1e1', borderBottom: '1px solid #e1e1e1' }} key={month}>
                <th>{month}</th>
                {dias.map((day) => (
                  <th className='border' style={{
                    border: '1px solid #e1e1e1',
                    backgroundColor: `#${getDayColor(daysTable[index][day - 1])}`
                  }} key={day + Number(month)}>
                    <Tooltip title={getKeyDescription(daysTable[index][day - 1])} arrow describeChild>
                      {
                        getDayColor(daysTable[index][day - 1]) === 'FFFFFF'
                          ? <pre className='p-0 m-0 text-black text-center'>{daysTable[index][day - 1]}</pre>
                          : <pre className='p-0 m-0 text-white text-center'>{daysTable[index][day - 1]}</pre>
                      }
                    </Tooltip>
                  </th>
                ))}
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
