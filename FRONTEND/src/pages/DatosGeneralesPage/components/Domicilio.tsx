import { InputAdornment, TextField } from '@mui/material'
import { Icon } from '../../../utils/Icon'
import { faMobile, faPhone } from '@fortawesome/free-solid-svg-icons'
import { Empleado } from '../../../models/empleado.model'

export const Domicilio = ({ empleado }: { empleado: Empleado }) => {
  const data = {
    email: empleado?.email ?? 'NA',
    calle: empleado?.direccion.calle ?? 'NA',
    numExt: empleado?.direccion?.numExt ?? 'NA',
    numInt: empleado?.direccion?.numInt ?? 'NA',
    telefono: empleado?.direccion?.telefono ?? 'NA',
    celular: empleado?.direccion?.celular ?? 'NA',
    codigoPostal: empleado?.direccion?.codPostal ?? 0,
    colonia: empleado?.direccion?.colonia?.descr ?? 'NA',
    estado: empleado?.direccion?.estado.descr ?? 'NA',
    ciudad: empleado?.direccion?.ciudad.descr ?? 'NA'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <TextField
        label='Calle'
        value={data.calle}
        variant="filled"
        InputProps={{ readOnly: true }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Num. Exterior'
        value={data.numExt}
        variant="filled"
        InputProps={{
          readOnly: true,
          startAdornment: <InputAdornment position="start">#</InputAdornment>
        }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Num. Interior'
        value={data.numInt}
        variant="filled"
        InputProps={{
          readOnly: true,
          startAdornment: <InputAdornment position="start">#</InputAdornment>
        }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Telefono'
        value={data.telefono}
        variant="filled"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position='start'>
              <Icon css='icon' icon={faPhone}></Icon>
            </InputAdornment>
          )
        }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Celular'
        value={data.celular}
        variant="filled"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position='start'>
              <Icon css='icon' icon={faMobile}></Icon>
            </InputAdornment>
          )
        }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Codigo Postal'
        value={data.codigoPostal}
        variant="filled"
        InputProps={{
          readOnly: true
        }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Estado'
        value={data.estado}
        variant="filled"
        InputProps={{
          readOnly: true
        }}
      />

      <TextField
        label='Municipio'
        value={data.ciudad}
        variant="filled"
        InputProps={{
          readOnly: true
        }}
      />

      <TextField
        label='Colonia'
        value={data.colonia}
        variant="filled"
        InputProps={{
          readOnly: true
        }}
      />

      <TextField
        label='Email'
        value={data.email}
        variant="filled"
        InputProps={{
          readOnly: true
        }}
      />
    </div>
  )
}
