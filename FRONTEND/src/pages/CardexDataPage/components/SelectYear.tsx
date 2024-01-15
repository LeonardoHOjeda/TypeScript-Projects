import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useEffect, useState } from 'react'
import { cardexService } from '../../../services/cardex.service'
import { CardexYears } from '../../../models/cardex.model'

export interface SelectedYearProps {
  onYearChange: (selectedYear: string) => void
}

export const SelectYear = ({ onYearChange }: SelectedYearProps) => {
  const [years, setYears] = useState<CardexYears[]>([])
  const [selectedYear, setSelectedYear] = useState('')

  useEffect(() => {
    cardexService.fetchYears()
      .then((years) => {
        setYears(years)
        setSelectedYear(years[0].acardex)
      })
      .catch((error) => {
        console.log('Error en fetchYears: ', error)
      })
  }, [])

  useEffect(() => {
    if (!selectedYear) return
    onYearChange(selectedYear)
  }, [selectedYear])

  return (
    <div className='text-center flex md:flex-row md:justify-around flex-col items-center'>
      <FormControl className="w-52 mb-5" variant='standard'>
        <InputLabel id="year">Año</InputLabel>
        <Select
          labelId="year"
          value={selectedYear}
          label="Year"
          onChange={(event) => setSelectedYear(event.target.value)}
        >
          {years.map((year) => (
            <MenuItem value={year.acardex} key={year.acardex}>
              {year.acardex}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
