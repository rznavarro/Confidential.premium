import React, { useEffect } from 'react'
import { X } from 'lucide-react'

const Modal = ({ title, children, onClose }) => {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleOverlayClick = (e) => {
    // Prevenir cierre al hacer click en el overlay
    // Solo se puede cerrar con el botón X o botones específicos
  }

  return (
    <div 
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-4 border-b border-dark-700/30">
          <h2 className="text-xl md:text-lg font-light text-gray-100 tracking-wide">{title}</h2>
          <button
            onClick={onClose}
            className="p-2.5 md:p-1.5 text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-dark-800/50 min-h-[44px] md:min-h-auto flex items-center justify-center"
          >
            <X className="w-5 h-5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal