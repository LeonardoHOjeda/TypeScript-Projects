import { FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import { useEffect, useState } from 'react'

export interface SelectedHolidayProps {
  onHolidayChange: (selectedHoliday: string) => void
}

export const HolidayType = ({ onHolidayChange }: SelectedHolidayProps) => {
  const [selectedHoliday, setSelectedHoliday] = useState<string>('2')

  useEffect(() => {
    if (!selectedHoliday) return
    onHolidayChange(selectedHoliday)
    setSelectedHoliday(selectedHoliday)
  }, [selectedHoliday])

  return (
    <Paper elevation={6} className="py-3 mx-auto text-center mb-5">
    <h2 className='text-md font-normal mt-0 text-center'>Estado de Cuenta de Vacaciones</h2>
    <FormControl sx={{ m: 1, minWidth: 200, mt: 3 }} variant='standard'>
      <InputLabel id="prestamo" variant="outlined">Tipo de Reporte</InputLabel>
      <Select labelId='holiday' label="Tipo de Reporte" value={selectedHoliday} onChange={(e) => setSelectedHoliday(e.target.value)}>
        <MenuItem value="2" key='2'>
          Resumen
        </MenuItem>
        <MenuItem value="1" key='1'>
          Detalle por año
        </MenuItem>
      </Select>
    </FormControl>
  </Paper>
  )
}
