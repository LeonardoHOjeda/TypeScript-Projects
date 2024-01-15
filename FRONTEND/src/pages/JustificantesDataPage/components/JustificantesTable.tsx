/* eslint-disable multiline-ternary */
import DataTable, { TableColumn } from 'react-data-table-component'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Bitacora, Justificante } from '../../../models/justificantes.model'
import { customStyles, formatDefaultDate, getMimeTypeFromUUID, paginationOptions, showErrors } from '../../../utils/helpers'
import { Icon } from '../../../utils/Icon'
import { faEraser, faFloppyDisk, faRectangleList, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material'
import { justificantesService } from '../../../services/justificantes.service'
import { toast } from 'react-toastify'
import { JustificanteModal } from './JustificanteModal'

interface ButtonState {
  [key: string]: boolean
}

export const JustificantesTable = ({ justificantesData, OnDeleteConfirm }: { justificantesData: Justificante[], OnDeleteConfirm: any }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [idJustificacion, setIdJustificacion] = useState(0)
  const [bitacoras, setBitacoras] = useState<Bitacora[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = async (idJustificacion: number) => {
    const bitacora = await justificantesService.fetchBitacoraJustificante(idJustificacion)
    setBitacoras(bitacora)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setBitacoras([])
    setIsModalOpen(false)
  }

  const [openDialog, setOpenDialog] = useState(false)
  const isOpenDialog = Boolean(openDialog)

  const [isLoadingDownloadButton, setIsLoadingDownloadButton] = useState<ButtonState>({})

  const [filterIncidencia, setFilterIncidencia] = useState('')
  const [filterEstatus, setFilterEstatus] = useState('')
  const [filterFechaInicio, setFilterFechaInicio] = useState('')

  const filterData = () => {
    return justificantesData?.filter((item: Justificante) => {
      const incidenceTypeMatch = (item.incidencia?.descr ?? '').toLowerCase().includes(filterIncidencia.toLowerCase()) || (item.incapacidad?.descr ?? '').toLowerCase().includes(filterIncidencia.toLowerCase())
      const statusMatch = (item.id_estado_solicitud ?? '').toString().includes(filterEstatus)
      const startDateMatch = formatDefaultDate(item.fecha_inicio)?.includes(filterFechaInicio)

      return incidenceTypeMatch && statusMatch && startDateMatch
    })
  }

  const downloadFile = async (uuid: number) => {
    try {
      const zip = new JSZip()
      const arrayEvidence = await justificantesService.fetchEvidencia(uuid)
      const evidencias = arrayEvidence.map(async (evidence) => {
        const fileData = await justificantesService.getFileData(evidence.referencia_evidencia)
        const fileName = fileData.awsObjectKey.split('/')[1]
        const fileExtension: string = fileName.split('.').pop()!.toLowerCase() // Obtener la extensión del UUID

        const mimeType = getMimeTypeFromUUID(fileExtension)
        const file = await justificantesService.fetchFileByUUID(evidence.referencia_evidencia, mimeType)
        zip.file(`${fileData.nombreArchivo}.${fileExtension}`, file)

        // saveAs(file, `${evidence.referencia_evidencia}.pdf`) // Utilizar file-saver para descargar el archivo

        return evidence.referencia_evidencia
      })

      await Promise.all(evidencias)

      const zipContent = await zip.generateAsync({ type: 'arraybuffer' })

      const zipBlob = new Blob([zipContent], { type: 'application/zip' })

      saveAs(zipBlob, 'Evidencias.zip')
    } catch (error: any) {
      console.error('Error en downloadFile: ', error)
      toast.error(error.response.data.message)
    }
    toggleDownloadButton(uuid)
  }

  const toggleDownloadButton = (rowId: number) => {
    setIsLoadingDownloadButton((prev) => ({
      ...prev,
      [rowId]: !prev[rowId] // Cambia el estado del botón de descarga para la fila especificada
    }))
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleClickDelete = () => {
    justificantesService.eliminarJustificante(idJustificacion)
      .then((justificante: Justificante) => {
        toast.success(`Se eliminó con éxito: ${justificante.folio_incidencia}`)
        OnDeleteConfirm()
      })
      .catch(showErrors)
    handleCloseDialog()
  }

  const handleClickOpenDialog = (id: number) => {
    setOpenDialog(true)
    setIdJustificacion(id)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const columns: Array<TableColumn<Justificante>> = [
    {
      name: <div className='text-center'>Fecha Solicitud</div>,
      selector: row => formatDefaultDate(row.fecha_solicitud) || 'No hay fecha para mostrar',
      center: true,
      sortable: true,
      minWidth: '150px'
    },
    {
      name: <div className='text-center'>Incidencia</div>,
      selector: row => (row.incidencia?.descr ?? row.incapacidad?.descr) ?? '',
      center: true,
      sortable: true,
      minWidth: '300px'
    },
    {
      name: <div className='text-center'>Días de Incidencia</div>,
      selector: row => row.dias_incidencia,
      center: true,
      sortable: true,
      minWidth: '120px'
    },
    {
      name: <div className='text-center'>Fecha Inicio</div>,
      selector: row => formatDefaultDate(row.fecha_inicio),
      center: true,
      sortable: true
    },
    {
      name: <div className='text-center'>Evidencias</div>,
      cell: row => {
        const isButtonDisabled = isLoadingDownloadButton[row.id_justificacion]
        return (
          <div>
              {isButtonDisabled ? (
                <div role="status">
                  <svg aria-hidden="true" className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <a href="#/" onClick={() => {
                  void downloadFile(row.id_justificacion)
                  toggleDownloadButton(row.id_justificacion) // Cambia el estado del botón de descarga después de la descarga
                }}>
                  <Icon css='icon' icon={faFloppyDisk} />
                </a>
              )}
            </div>
        )
      },
      center: true
    },
    {
      name: <div className='text-center'>Folio</div>,
      selector: row => row.folio_incidencia,
      center: true,
      sortable: true,
      minWidth: '200px'
    },
    {
      name: <div className='text-center'>Motivo</div>,
      cell: (row) => <p>{row.motivo}</p>,
      center: true
    },
    {
      name: <div className='text-center'>Observaciones</div>,
      cell: (row) => <p>{row.observaciones}</p>,
      center: true,
      minWidth: '200px'
    },
    {
      name: <div className='text-center'>Estado de Solicitud</div>,
      cell: (row) => {
        const getClasses = () => {
          const statusId = row.nivel?.id_estatus

          if (statusId === 1) {
            return 'bg-blue-100 text-blue-800'
          } else if (statusId === 2 || statusId === 4 || statusId === 6) {
            return 'bg-green-100 text-green-800'
          } else if (statusId === 3 || statusId === 5 || statusId === 7) {
            return 'bg-red-100 text-red-800'
          } else {
            return 'bg-gray-100 text-gray-800'
          }
        }
        const classes = getClasses()

        return (
          <p className={`text-xs font-medium mr-2 px-2.5 rounded ${classes}`}>{row.nivel?.etiqueta}</p>
        )
      },
      center: true,
      sortable: true,
      minWidth: '120px'
    },
    {
      name: <div className='text-center'>Acciones</div>,
      cell: (row, index) =>
        <>
        <div className='grid grid-cols-2 gap-2'>
          <button className={`border-0 hover:cursor-pointer  ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`} onClick={() => { handleClickOpenDialog(row.id_justificacion); handleClose() }}>
            <FontAwesomeIcon className="text-red-600" icon={faTrashCan} size="2x" />
          </button>
          <button className={`border-0 hover:cursor-pointer grid grid-cols-2 gap-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`} onClick={() => { void handleOpenModal(row.id_justificacion); handleClose() }}>
          <Tooltip title="Ver bitácora">
            <FontAwesomeIcon className="text-blue-600" icon={faRectangleList} size="2x" />
          </Tooltip>
          </button>

        </div>
        </>,
      center: true,
      sortable: true,
      minWidth: '120px'
    }
  ]

  const subHeading = (
    <div className="flex flex-col md:flex-row w-full gap-2">
      <input
        type="text"
        placeholder="Filtrar por incidencia"
        value={filterIncidencia}
        onChange={(e) => setFilterIncidencia(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 md:w-36"
      />
      <input
        type="text"
        placeholder="Filtrar por estatus"
        value={filterEstatus}
        onChange={(e) => setFilterEstatus(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 md:w-36"
      />
      <input
        type="text"
        placeholder="Filtrar por fecha inicio"
        value={filterFechaInicio}
        onChange={(e) => setFilterFechaInicio(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 md:w-36"
      />
      <button
        onClick={() => {
          setFilterIncidencia('')
          setFilterEstatus('')
          setFilterFechaInicio('')
        }}
        disabled={!filterIncidencia && !filterEstatus && !filterFechaInicio}
        className={`text-white border-secondary bg-secondary   focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center ${(!filterIncidencia && !filterEstatus && !filterFechaInicio) ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:border-blue-800 hover:bg-blue-800'}`}
      >
        <div className="flex justify-center">
          <span className="mr-2 uppercase font-bold">Limpiar filtros</span>
          <Icon css="icon" icon={faEraser} />
        </div>
      </button>
    </div>
  )

  return (
    <div className='min-2-full mt-4'>
      <DataTable
        columns={columns}
        dense={true}
        customStyles={customStyles}
        data={filterData()}
        fixedHeader
        noDataComponent="No hay información para mostrar"
        pagination
        paginationComponentOptions={paginationOptions}
        responsive={true}
        striped
        subHeader={true}
        subHeaderComponent={subHeading}
      />
      <Dialog open={isOpenDialog} onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Eliminar Justificación'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de eliminar el elemento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='error'>Cancelar</Button>
          <Button onClick={handleClickDelete} color='info' autoFocus>Eliminar</Button>
        </DialogActions>
      </Dialog>

      <JustificanteModal isOpen={isModalOpen} onClose={handleCloseModal} bitacoras={bitacoras} />
    </div>
  )
}
