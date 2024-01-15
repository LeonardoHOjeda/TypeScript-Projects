import { CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { empleadoService } from '../../../services/empleado.service'
import { Empleado } from '../../../models/empleado.model'
import { formatDefaultDate, getAge } from '../../../utils/helpers'
import Avatar from '../../../assets/img/avatar.png'

export const DatosGenerales = ({ empleado }: { empleado: Empleado }) => {
  const [image, setImage] = useState('')
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true)

  useEffect(() => {
    empleadoService.fetchFoto()
      .then(foto => setImage(foto))
      .catch(error => console.error(`Error: ${error}`))
      .finally(() => setIsLoadingPhoto(false))
  }, [])

  const data = {
    nombre: `${empleado?.nombre} ${empleado?.apPaterno} ${empleado?.apMaterno}`,
    idEmp: empleado?.id_emp,
    edad: getAge(empleado?.rfcFecha),
    fechaNacimineto: formatDefaultDate(empleado?.rfcFecha) ?? 'Fecha Invalida',
    noempx: empleado?.noempx,
    imss: empleado?.imss ?? 'NA',
    rfc: empleado?.rfc ?? 'NA',
    curp: empleado?.curp ?? 'NA',
    sexo: empleado?.sexo ?? 'NA',
    rfcfecha: ((empleado?.rfcFecha) != null) ?? 'NA',
    lunac: empleado?.lunac ?? 'NA',
    ISSSTE: empleado?.issste ?? 'NA',
    nacionalidad: empleado?.nacionalidad.descr ?? 'NA',
    estadoNac: empleado?.estado_nacimiento?.descr ?? 'NA',
    estadoCivil: empleado?.estado_civil.descripcion ?? 'NA'
  }

  return (

    <div className='flex items-start flex-wrap md:flex-nowrap'>
      <div className="w-full md:w-3/12 text-center mb-4 mr-5">
        { isLoadingPhoto
          ? <div className="flex justify-center items-center h-52">
            <CircularProgress color='secondary' />
          </div>
          : <img src={`${(image.length > 0) ? `data:image/jpeg;base64,${image}` : `${Avatar}`}`} alt='Foto de Perfil' height={300} className='object-contain'/>

        }
      </div>

      <div className="md:w-9/12 mx-auto">
        <div className="mt-3">
          <label className='text-gray-500 mt-9 '>Informacion Personal</label>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <TextField

            label='Nombre'
            variant='filled'
            value={data.nombre}
            InputProps={{
              readOnly: true,
              style: {
                overflowWrap: 'break-word'
              }
            }}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField
            label='Fecha de Nacimiento'
            value={data.fechaNacimineto}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='Edad'
            value={data.edad}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='NSS'
            value={data.imss}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='ISSSTE'
            value={data.ISSSTE}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='RFC'
            value={data.rfc}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='CURP'
            value={data.curp}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="mt-3">
          <label className='text-gray-500 mt-9 '>Informacion de origen</label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField
            label='Lugar de Nacimiento'
            value={data.lunac}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='Estado'
            value={data.estadoNac}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='Pais de Origen'
            value={data.nacionalidad}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='Estado Civil'
            value={data.estadoCivil}
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl>
            <FormLabel id="sexo">Sexo</FormLabel>
            <RadioGroup row aria-labelledby="sexo" name="sexo" value={data.sexo}>
              <FormControlLabel value="F" control={<Radio />} label="Femenino" color="warning"/>
              <FormControlLabel value="M" control={<Radio />} label="Masculino" color="success" />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </div>
  )
}
