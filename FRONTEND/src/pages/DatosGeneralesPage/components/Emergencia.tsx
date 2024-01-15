import { InputAdornment, TextField } from '@mui/material'
import { Icon } from '../../../utils/Icon'
import { faMobile, faPhone } from '@fortawesome/free-solid-svg-icons'
import { Nomina } from '../../../models/nomina.model'

export const Emergencia = ({ empleado }: { empleado: Nomina }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TextField
        label='Nombre'
        value={empleado?.contacto?.nombre ?? 'NA'}
        variant="filled"
        InputProps={{
          readOnly: true
        }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Apellido Paterno'
        value={empleado?.contacto.apPaterno ?? 'NA'}
        variant="filled"
        InputProps={{
          readOnly: true
        }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Apellido Materno'
        value={empleado?.contacto.apMaterno ?? 'NA'}
        variant="filled"
        InputProps={{
          readOnly: true
        }}
      />

      <TextField
        label='Telefono Celular'
        value={empleado?.contacto.telefonoE ?? 'NA'}
        variant="filled"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position='start'>
              <Icon css='icon' icon={faMobile}></Icon>
            </InputAdornment>
          )
        }}
      />

      <TextField
        label='Telefono Particular'
        value={empleado?.contacto.celular ?? 'NA'}
        variant="filled"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position='start'>
              <Icon css='icon' icon={faPhone}></Icon>
            </InputAdornment>
          )
        }}
      />

    </div>
  )
}
