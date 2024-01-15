/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/naming-convention */
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect, useRef, useState } from 'react'
import { justificantesService } from '../../../services/justificantes.service'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { Icon } from '../../../utils/Icon'
import { faFileArrowUp, faFloppyDisk, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useUserContext } from '../../../context/UserContext'
import { Incapacidad, Incidencia } from '../../../models/justificantes.model'

export const JustificanteData = ({ onFormSubmit }: any) => {
  const { id_emp } = useUserContext()

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isLoadingButton, setIsLoadingButton] = useState(false)
  // const [isSizeCorrect, setIsSizeCorrect] = useState(true)

  const [formattedData, setFormattedData] = useState<any>([])

  const [selectedType, setSelectedType] = useState(0)
  const [isMandatory, setIsMandatory] = useState(false)
  const [selectedReason, setSelectedReason] = useState<number | string>(0)
  const [motivo, setMotivo] = useState('')

  const [file, setFile] = useState<File[]>([])

  const [numDays, setNumDays] = useState(1)

  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs())
  const [captureType, setCaptureType] = useState(0)

  const [selectedDate, setSelectedDate] = useState(dayjs(startDate))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [myDate, setMyDate] = useState('')

  const fileInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    dayjs.locale('ES')

    const fetchData = async () => {
      const captureType = await justificantesService.fetchTipoCaptura()

      if (captureType.tipo_captura_justificacion === 1) {
        try {
          const startDateService = await justificantesService.fetchFechaInicio()
          const adjustedStartDate = startDateService.replace('Z', '')
          const maximumDays = await justificantesService.fetchDiasPermitidos()

          const startDateDayjs = dayjs(adjustedStartDate)
          const endDateDayjs = startDateDayjs.add(maximumDays.dias_captura_justificacion === 1 ? maximumDays.dias_captura_justificacion : maximumDays.dias_captura_justificacion - 1, 'day')

          setStartDate(startDateDayjs)
          setEndDate(endDateDayjs)

          setSelectedDate(startDateDayjs)

          const captureTypeService = await justificantesService.fetchTipoCaptura()
          setCaptureType(captureTypeService.tipo_captura_justificacion)
        } catch (error) {
          console.info('Error en el proceso de obtener fecha inicio: ', error)
        }
      }
    }
    void fetchData()
  }, [])

  useEffect(() => {
    const parsedDate = dayjs(myDate)
    setSelectedDate(parsedDate)
  }, [myDate])

  useEffect(() => {
    setMotivo('')
  }, [selectedType])

  useEffect(() => {
    if (!selectedDate.isValid() || selectedType === 0 || selectedReason === 0 || (isMandatory && file.length === 0)) {
      setIsButtonDisabled(true)
    } else {
      setIsButtonDisabled(false)
      setIsMandatory(false)
    }

    const selectedIncident = formattedData.find((incident: any) => incident.value === selectedReason)
    if (selectedIncident) {
      if (selectedIncident.evidencia === 'SI' && file.length === 0) {
        setIsMandatory(true)
      } else {
        setIsMandatory(false)
      }
    }
  }, [numDays, selectedDate, selectedType, selectedReason, file])

  function handleFileUpload (event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files
    const maxSizeInBytes = 1 * 1024 * 1024 // 1MB
    if (fileList) {
      const uploadedFiles = Array.from(fileList)
      const filterFilesSize = uploadedFiles.filter((file) => {
        const isFileTooLarge = file.size > maxSizeInBytes
        if (isFileTooLarge) {
          toast.error(`El archivo ${file.name} es demasiado grande. El tamaño máximo permitido es de 1MB.`)
          setIsButtonDisabled(true)
        }
        return !isFileTooLarge
      })

      const filterFilesType = filterFilesSize.filter((file) => {
        const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf']
        const isFileTypeValid = allowedFileTypes.includes(file.type)
        if (!isFileTypeValid) {
          toast.error(`El archivo ${file.name} no es un tipo de archivo válido. Los tipos de archivo permitidos son: .jpg, .png, .pdf`)
          setIsButtonDisabled(true)
        }
        return isFileTypeValid
      })

      const newFiles = filterFilesType
      if (newFiles && newFiles.length > 0) {
        setFile((prevFiles) => [...prevFiles, ...newFiles])
      }
    }
  }

  function handleFileDelete (indexToDelete: number) {
    // Crear una copia del arreglo file para no mutar el estado directamente
    const updatedFile = [...file]

    // Eliminar el archivo del arreglo usando el índice proporcionado
    updatedFile.splice(indexToDelete, 1)

    // Actualizar el estado con el nuevo arreglo que no incluye el archivo eliminado
    setFile(updatedFile)
    fileInput.current!.value = ''
  }

  async function handleSubmit (event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault()
    setIsLoadingButton(true)

    if (file.length === 0 && isMandatory) {
      toast.error('¡Es obligatorio subir la documentación requerida!')
      setIsLoadingButton(false)
      throw new Error()
    }

    try {
      const empleado = JSON.parse(localStorage.getItem('empleadoData')!)
      const addJustificante = await justificantesService.crearJustificante(
        id_emp,
        selectedType,
        selectedReason,
        selectedDate.format('MM-DD-YYYY'),
        numDays,
        motivo,
        empleado.id_cia
      )

      toast.success('¡Se ha registrado el justificante de manera correcta!')
      setSelectedType(0)
      setSelectedReason(0)
      setNumDays(1)
      setSelectedDate(dayjs(null))
      setFile([])
      const idJustificante = (await addJustificante).justificante.id_justificacion

      if (file.length === 0) {
        setIsLoadingButton(false)
        onFormSubmit()
        return
      }

      const tenantId = await justificantesService.fetchTenantId()
      console.log('tenantId: ', tenantId)

      for (let index = 0; index < file.length; index++) {
        const currentFile = file[index]

        try {
          const fileUploaded = justificantesService.subirArchivo(currentFile, tenantId.idTenant)

          const referencia_evidencia = (await fileUploaded).uuid
          await justificantesService.agregarEvidencia(idJustificante, referencia_evidencia)
        } catch (error: any) {
          console.info('Error al subir el archivo: ', error)
          await justificantesService.eliminarJustificante(idJustificante)
          toast.error(`Error en subir evidencia(s):${error.response?.data?.message}`)
        }
      }
      onFormSubmit()
      fileInput.current!.value = ''
      toast.success('¡Se han subido los archivos correctamente!')
    } catch (error: any) {
      console.info('Error en addEvidencia: ', error)
      const errorMessages = error.response?.data?.message || []

      errorMessages.forEach((errorMessage: any) => {
        const { msg } = errorMessage
        toast.error(`${msg}`)
      })
    } finally {
      setIsLoadingButton(false)
    }
  }

  const formatIncident = (incident: Incapacidad | Incidencia) => {
    if ('razInc' in incident) {
      // El objeto 'incident' es de tipo 'Incapacidades'
      if (selectedType === 1) {
        return {
          value: incident.id_razInc,
          label: incident.descr,
          evidencia: incident.evidencia
        }
      }
    } else {
      // El objeto 'incident' es de tipo 'IncidenciaModel'
      if (selectedType === 2) {
        return {
          value: incident.id_razFal,
          label: incident.descr,
          evidencia: incident.evidencia
        }
      }
    }
  }

  /* Cada vez que cambia el tipo de justificante */
  useEffect(() => {
    if (!selectedType) return
    setSelectedReason(0)
    if (selectedType === 1) {
      justificantesService.fetchIncapacidades()
        .then((data) => {
          const formattedData = data.map(formatIncident)
          setFormattedData(formattedData)
        })
        .catch(console.log)
    } else if (selectedType === 2) {
      justificantesService.fetchIncidencias()
        .then((data: any) => {
          const formattedData = data.map(formatIncident)
          setFormattedData(formattedData)
        })
        .catch(console.log)
    }
  }, [selectedType])

  const shouldDisableDate = (day: any) => {
    const dayjsDay = dayjs(day)

    if (captureType === 0) {
      return false
    }
    return dayjsDay.isBefore(startDate, 'day') || dayjsDay.isAfter(endDate, 'day')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === '+') {
      e.preventDefault()
    }
  }

  return (
    <div>
      <Paper elevation={6} className="py-3 mx-auto mb-5">
        <h2 className='text-md font-normal mt-0 text-center'>Justificantes</h2>
        <Box component='form'>

          <div className='flex md:flex-row flex-col md:justify-around text-center items-center'>
            <FormControl sx={{ m: 1, minWidth: 200, mt: 3 }} variant='standard'>
              <InputLabel id="justificante" variant="outlined">Tipo de Solicitud</InputLabel>
              <Select
                labelId='justificante'
                label="Tipo Justificante"
                value={selectedType}
                onChange={(e) => setSelectedType(+e.target.value)}
              >
                <MenuItem key={0} value={0} disabled selected>
                  [Seleccione Tipo]
                </MenuItem>
                <MenuItem key={1} value={1}>
                  Incapacidades
                </MenuItem>
                <MenuItem key={2} value={2}>
                  Incidencias
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 200, mt: 3 }} variant='standard'>
              <InputLabel id="reason" variant="outlined">Tipo Justificante</InputLabel>
              <Select
                labelId='reason'
                label="Motvo Justificante"
                value={selectedReason}
                disabled={selectedType === 0}
                onChange={(e) => {
                  setSelectedReason(+e.target.value)
                  setIsMandatory(e.target.value === 'SI')
                }}
              >
                <MenuItem key={0} value={0} disabled selected>
                  [Seleccione Motivo]
                </MenuItem>
                {formattedData.map((dato: any) => (
                  <MenuItem key={dato.value} value={dato.value}>
                    {dato.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className='flex md:flex-row flex-col md:justify-around text-center items-center mt-5 gap-5'>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DatePicker
                label="Selecciona una fecha"
                shouldDisableDate={shouldDisableDate}
                value={selectedDate}
                views={['day']}
                format='DD/MMMM/YY'
                onChange={(newValue) => setSelectedDate(newValue! || null)}
              />
              <TextField
                type='number'
                label="Días"
                value={numDays}
                onChange={(e) => setNumDays(Number(e.target.value))}
                onKeyDown={handleKeyDown}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 1 }}
              />
            </LocalizationProvider>
          </div>

          {selectedType === 2 && (
            <div className='text-center my-5 mx-8 md:mx-36 space-y-4 '>
              <TextField
                id="motivo"
                fullWidth
                helperText="Maximo 200 caracteres"
                label="Motivo de la incidencia"
                onChange={(event) => setMotivo(event.target.value)}
                multiline
                rows={4}
                variant="filled"
              />
            </div>)}

          <div className='flex flex-col md:justify-center text-center items-center gap-1 mt-3'>
            <label htmlFor="input-file" className='font-bold'>Subir Comprobante</label>
            {isMandatory && (
              <p className='bg-red-500 text-white py-2 px-4 rounded text-sm'>La documentación para el tipo de justificación seleccionado es requerida</p>
            )}
            <label htmlFor="input-file" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer flex">
              <p className='my-0 mr-3'>Seleccionar Archivo</p>
              <Icon css='icon' icon={faFileArrowUp}></Icon>
            </label>
            <input id="input-file" type="file" className="hidden" accept='image/jpeg, image/png, application/pdf' onChange={handleFileUpload} required={isMandatory} multiple ref={fileInput}/>
          </div>
          {file && Array.isArray(file) && file.map((fileItem, index) => (
            <div key={index}>
              {index === 0 && (<h2 className='text-center mt-5 mb-0'>Archivos Subidos</h2>)}
              <div className="flex justify-center items-center mt-3">
                <div className="mx-auto w-4/5">
                  <div className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="mr-2 text-sm font-medium text-gray-800">{fileItem.name}</span>
                    <label
                      onClick={() => handleFileDelete(index)}
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 cursor-pointer flex"
                    >
                      <p className='my-0 mr-3'>Eliminar</p>
                      <Icon css='icon' icon={faTrash}></Icon>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className='flex flex-col md:justify-center text-center items-center gap-1 mt-3'>
          </div>
        </Box>
      </Paper>
      <div className='flex justify-center'>
      {isLoadingButton
        ? (
                <button type="submit" className="w-60 md:w-80 text-gray-600 border-gray-300 bg-gray-300 focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center cursor-not-allowed">
                  <span className='mr-2 uppercase font-bold'>Cargando</span>
                  <div role="status">
                    <svg aria-hidden="true" className="w-auto h-4 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                  </div>
                </button>
          )
        : (
                <button onClick={handleSubmit} className={`w-60 md:w-80 text-white border-orange-500 bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:border-orange-700 hover:bg-orange-700'}`} disabled={isButtonDisabled}>
                  <div className='flex justify-center'>
                    <span className='mr-2 uppercase font-bold'>Enviar Justificación</span>
                    <Icon css='icon' icon={faFloppyDisk} />
                  </div>
                </button>
          )
      }
      </div>
      {/* <div className='flex justify-center'>
        <Button variant='contained' size='large' color='warning' onClick={handleSubmit} disabled={isButtonDisabled}>
          <p className='my-0 mr-3'>Enviar Justificante</p>
          <Icon css='icon' icon={faFloppyDisk}></Icon>
        </Button>
      </div> */}
    </div>
  )
}
