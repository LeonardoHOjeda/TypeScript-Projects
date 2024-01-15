/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { ModalComponent } from '../../../components/ModalComponent'
import { formatDate } from '../../../utils/helpers'
import { Bitacora } from '../../../models/justificantes.model'

interface JustificanteModalProps {
  isOpen: boolean
  onClose: () => void
  bitacoras: Bitacora[]
}

export const JustificanteModal = ({ isOpen, onClose, bitacoras }: JustificanteModalProps) => {
  const [activeRows, setActiveRows] = useState<number[]>([])

  useEffect(() => {
    if (!isOpen) {
      setActiveRows([])
    }
  }, [isOpen])

  const handleToggleActive = (id_estado_solicitud: number) => {
    if (activeRows.includes(id_estado_solicitud)) {
      setActiveRows(activeRows.filter(row => row !== id_estado_solicitud))
    } else {
      setActiveRows([...activeRows, id_estado_solicitud])
    }
  }

  const isActive = (id_estado_solicitud: number) => activeRows.includes(id_estado_solicitud)

  const getBackgroundColorClass = (id_estado_solicitud: number) => {
    if (id_estado_solicitud === 2 || id_estado_solicitud === 4 || id_estado_solicitud === 6) {
      return 'bg-green-100 text-green-800'
    } else if (id_estado_solicitud === 3 || id_estado_solicitud === 5 || id_estado_solicitud === 7) {
      return 'bg-red-100 text-red-800'
    } else if (id_estado_solicitud === 1) {
      return 'bg-blue-100 text-blue-800'
    } else {
      return '' // Default class
    }
  }

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} title='Bitacora del justificante' subtitle={bitacoras[0]?.justificante.folio_incidencia}>
      {bitacoras.map((bitacora: Bitacora) => (
        <div className="p-1 flex justify-center items-center" key={bitacora.id_estado_solicitud}>
            <div className="list">
              <div className={`bg-[#e9e9e9] p-5 border border-[#c9c6c655] rounded-md  w-[450px] duration-500 group ${isActive(bitacora.id_estado_solicitud) ? 'is-active' : ''}`} onClick={() => handleToggleActive(bitacora.id_estado_solicitud)}>
                <div className="flex items-center">
                  <div className={`w-full duration-500 cursor-pointer ${isActive(bitacora.id_estado_solicitud) ? 'font-bold' : ''}`}>{formatDate(bitacora.fecha_aplicacion)}</div>
                  <FontAwesomeIcon className={`${isActive(bitacora.id_estado_solicitud) ? 'rotate-[180deg]' : ''}`} icon={faCaretDown} size="2x" />
                </div>
                <div className={`overflow-hidden max-h-0 duration-500 ${isActive(bitacora.id_estado_solicitud) ? 'max-h-[100px]' : ''}`}>
                  <p className='p-0 m-0 font-bold'>Folio: <span className='text-base font-medium mr-2 px-2.5 rounded bg-yellow-100 text-yellow-800'>{bitacora.justificante.folio_incidencia}</span></p>
                  <p className='p-0 m-0 font-bold'>Estado: <span className={`text-base font-medium mr-2 px-2.5 rounded ${getBackgroundColorClass(bitacora.id_estado_solicitud)}`}>{bitacora.estatus.etiqueta}</span></p>
                  <p className='p-0 m-0 font-bold'>Observaciones: <span className='font-normal'>{bitacora.observaciones ?? 'NA'}</span></p>
                </div>
              </div>
            </div>
          </div>
      ))}
    </ModalComponent>
  )
}
