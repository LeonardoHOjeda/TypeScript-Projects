import { Backdrop, CircularProgress, FormControl, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { empleadoService } from '../../../services/empleado.service'
import { Icon } from '../../../utils/Icon'
import { faCircleInfo, faTableList } from '@fortawesome/free-solid-svg-icons'
import { Concepto, Fechas } from '../../../models/fondo_ahorro.model'

export interface SelectedPeriodProps {
  onPeriodChange: (selectedPeriod: string) => void
}

export const SavingsData = ({ onPeriodChange }: SelectedPeriodProps) => {
  const [periodos, setPeriodos] = useState<Fechas[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string | number>('')
  const [conceptos, setConceptos] = useState<Concepto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    empleadoService.fetchCiclos()
      .then((periodo) => setPeriodos((periodo)))
      .catch(console.log)
    empleadoService.fetchConceptos()
      .then((concepto) => {
        setConceptos((concepto))
        setIsLoading(false)
      })
      .catch(console.log)
  }, [])

  useEffect(() => {
    if (!selectedPeriod) return
    onPeriodChange(selectedPeriod as string)
    setSelectedPeriod(selectedPeriod)
  }, [selectedPeriod])

  const empleado = {
    concepto: conceptos?.[0]?.id_concepto ?? 'NA',
    descripcion: conceptos?.[0]?.descripcion ?? 'NA'
  }

  const nomina = {
    concepto: conceptos?.[1]?.id_concepto,
    descripcion: conceptos?.[1]?.descripcion
  }

  return (
    <div>
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper elevation={6} className="py-3 mx-auto text-center mb-5">
        <div className='flex flex-col md:flex-row justify-center'>
          <div>
            <h3 className='text-md font-normal mt-0 text-center'>Concepto Empleado</h3>
            <div className='my-4 flex flex-col gap-4 md:flex-row justify-center px-4'>
              <TextField
                label='Concepto'
                value={`${empleado.concepto}`}
                variant='filled'
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon css='icon' icon={faCircleInfo}/>
                    </InputAdornment>
                  )
                }}
                />
              <TextField
                label='Descripción'
                value={`${empleado.descripcion}`}
                variant='filled'
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon css='icon' icon={faTableList}/>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>

          <div>
            <h3 className='text-md font-normal mt-0 text-center'>Concepto Empresa</h3>
            <div className='my-4 flex flex-col gap-4 md:flex-row justify-center px-4'>
              <TextField
                label='Concepto'
                value={`${nomina.concepto}`}
                variant='filled'
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon css='icon' icon={faCircleInfo}/>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label='Descripción'
                value={`${nomina.descripcion}`}
                variant='filled'
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon css='icon' icon={faTableList}/>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>
        </div>

        <FormControl sx={{ m: 1, minWidth: 200, mt: 3 }} variant='standard'>
          <InputLabel id="prestamo" variant="outlined">Ciclo</InputLabel>
          <Select
            onChange={(event) => setSelectedPeriod(event.target.value)}
            labelId='holiday'
            label="Tipo de Reporte"
            defaultValue={0}
          >
            <MenuItem key={0} value={0} disabled selected>
              [Seleccione Ciclo]
            </MenuItem>
              {periodos.map((periodo, index) => (
              <MenuItem value={`${periodo.fechaCorte},${index > 0 ? periodos[index - 1].fechaCorte : ''}`} key={periodo.comentarios}>
                {periodo.comentarios}
              </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Paper>
    </div>
  )
}
