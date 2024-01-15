import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useScrollBlock } from '../hooks/useScroll'
import { useEffect } from 'react'

interface ModalComponentProps {
  title?: string
  subtitle?: string
  isOpen: boolean
  onClose: () => void
  actions?: React.ReactNode
  children: React.ReactNode
}

export const ModalComponent = ({ title, subtitle, isOpen, onClose, actions, children }: ModalComponentProps) => {
  const { blockScroll, allowScroll } = useScrollBlock()
  const handleOverlayClick = (event: any) => {
    if (event.target.classList.contains('backdrop-blur-sm')) {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      blockScroll()
    } else {
      allowScroll()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[1201]' onClick={handleOverlayClick}>
      <div className="relative bg-white px-8 pt-8 pb-6 rounded-xl max-h-[800px] overflow-auto">
        <div className='w-fit absolute top-4 right-6 p-0 m-0 hover:cursor-pointer' onClick={() => onClose()}>
          <FontAwesomeIcon className="text-gray-500 hover:text-gray-600" icon={faXmark} size="2x" />
        </div>
        {title && (
          <h2 className='text-center m-0'>{title}</h2>
        )}
        {subtitle && (
          <h3 className='text-center p-0 m-0 mb-2'>{subtitle}</h3>
        )}
        {children}
        {actions && (
          <div className="flex justify-end gap-3 mt-5">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
