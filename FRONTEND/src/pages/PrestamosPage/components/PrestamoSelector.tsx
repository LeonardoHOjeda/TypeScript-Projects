import { Alert, AlertTitle, Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import { useEffect, useState } from 'react'
import { empleadoService } from '../../../services/empleado.service'
import { Prestamo } from '../../../models/prestamos.model'

export interface SelectedLoanProps {
  onLoanChange: (selectedPrestamo: string | number) => void
}

export const Selector = ({ onLoanChange }: SelectedLoanProps) => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [selectedPrestamo, setSelectedPrestamo] = useState<string | number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    empleadoService.fetchPrestamos()
      .then((prestamo) => {
        setPrestamos(prestamo)
        setIsLoading(false)
      })
      .catch(console.log)
  }, [])

  useEffect(() => {
    if (!selectedPrestamo) return
    onLoanChange(selectedPrestamo)
    setSelectedPrestamo(selectedPrestamo)
  }, [selectedPrestamo])

  return (
    <div className='mb-5'>
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper elevation={6} className="py-3 mx-auto text-center mb-5">
        <h2 className='test-md font-normal mt-0 text-center'>Préstamos</h2>
        {prestamos.length > 0
          ? (
          <FormControl sx={{ m: 1, minWidth: 200, mt: 3 }} variant='standard'>
            <InputLabel id="prestamo" variant="outlined">Concepto</InputLabel>
            <Select labelId='prestamo' label="Concepto" value={selectedPrestamo} onChange={(e) => setSelectedPrestamo(e.target.value)}>
              <MenuItem value={0} key={0} selected disabled>
                [Seleccione Concepto]
              </MenuItem>
              {prestamos.map((prestamo) => (
                <MenuItem value={prestamo.id_concepto} key={prestamo.id_concepto} >
                  {prestamo.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            )
          : (
          <div className='text-left mx-10'>
            <Alert severity="info">
              <AlertTitle>Información importante</AlertTitle>
              No existen préstamos para poder consultar.
            </Alert>
          </div>
            )
        }

      </Paper>
    </div>
  )
}
