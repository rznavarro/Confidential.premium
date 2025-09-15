import React, { useState } from 'react'
import { Plus, Eye, Download, Trash2, FileText, Calendar } from 'lucide-react'
import jsPDF from 'jspdf'
import Modal from './Modal'

const ReportsSection = ({ reports, onReportsUpdate }) => {
  const currentUser = JSON.parse(localStorage.getItem('vortexia_user') || '{}')
  const isCEO = currentUser.level === 'ceo'

  const [showModal, setShowModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [formData, setFormData] = useState({
    contactos: '',
    mensajesIniciales: '',
    respuestas: '',
    ...(isCEO ? { reuniones: '' } : {})
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newReport = {
      id: Date.now(),
      ...formData,
      contactos: parseInt(formData.contactos) || 0,
      mensajesIniciales: parseInt(formData.mensajesIniciales) || 0,
      respuestas: parseInt(formData.respuestas) || 0,
      ...(isCEO ? { reuniones: parseInt(formData.reuniones) || 0 } : {}),
      fecha: new Date().toISOString(),
      fechaFormateada: new Date().toLocaleDateString('es-CL')
    }

    onReportsUpdate([...reports, newReport])
    setFormData({
      contactos: '',
      mensajesIniciales: '',
      respuestas: '',
      ...(isCEO ? { reuniones: '' } : {})
    })
    setShowModal(false)
  }

  const handleDelete = (reportId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      onReportsUpdate(reports.filter(report => report.id !== reportId))
    }
  }

  const handleView = (report) => {
    setSelectedReport(report)
  }

  const handleDownload = (report) => {
    const pdf = new jsPDF()
    
    const textColor = [55, 65, 81] // Gray-700
    const lightGray = [156, 163, 175] // Gray-400
    
    let yPosition = 20
    
    // Título del documento
    pdf.setTextColor(...textColor)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('VORTEXIA - REPORTE DE ACTIVIDAD DE VENTAS', 20, yPosition)
    yPosition += 20
    
    // Información del empleado
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('INFORMACIÓN DEL EMPLEADO', 20, yPosition)
    yPosition += 10
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Empleado: ${currentUser.name}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Rol: ${currentUser.role}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Fecha del reporte: ${report.fechaFormateada}`, 20, yPosition)
    yPosition += 20
    
    // Métricas de actividad
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('METRICAS DE ACTIVIDAD', 20, yPosition)
    yPosition += 15
    
    // Contactos
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CONTACTOS REALIZADOS', 20, yPosition)
    yPosition += 8
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Cantidad: ${report.contactos}`, 30, yPosition)
    yPosition += 12
    
    // Mensajes
    pdf.setFont('helvetica', 'bold')
    pdf.text('MENSAJES INICIALES ENVIADOS', 20, yPosition)
    yPosition += 8
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Cantidad: ${report.mensajesIniciales}`, 30, yPosition)
    yPosition += 12
    
    // Respuestas
    pdf.setFont('helvetica', 'bold')
    pdf.text('RESPUESTAS RECIBIDAS', 20, yPosition)
    yPosition += 8
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Cantidad: ${report.respuestas}`, 30, yPosition)
    yPosition += 6
    pdf.text(`Tasa de respuesta: ${report.mensajesIniciales > 0 ? Math.round((report.respuestas / report.mensajesIniciales) * 100) : 0}%`, 30, yPosition)
    yPosition += 12
    
    // Reuniones (solo CEO)
    if (isCEO) {
      pdf.setFont('helvetica', 'bold')
      pdf.text('REUNIONES AGENDADAS', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Cantidad: ${report.reuniones}`, 30, yPosition)
      yPosition += 6
      pdf.text(`Conversión: ${report.respuestas > 0 ? Math.round((report.reuniones / report.respuestas) * 100) : 0}%`, 30, yPosition)
      yPosition += 15
    }
    
    // Análisis de rendimiento
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('ANALISIS DE RENDIMIENTO', 20, yPosition)
    yPosition += 15
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`- Ratio Contacto-Mensaje: ${report.contactos > 0 ? Math.round((report.mensajesIniciales / report.contactos) * 100) : 0}%`, 20, yPosition)
    yPosition += 6
    pdf.text(`- Efectividad de respuesta: ${report.mensajesIniciales > 0 ? Math.round((report.respuestas / report.mensajesIniciales) * 100) : 0}%`, 20, yPosition)
    yPosition += 6
    
    if (isCEO) {
      pdf.text(`- Conversion a reunion: ${report.respuestas > 0 ? Math.round((report.reuniones / report.respuestas) * 100) : 0}%`, 20, yPosition)
      yPosition += 15
    } else {
      yPosition += 15
    }
    
    // Información del documento
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('INFORMACION DEL DOCUMENTO', 20, yPosition)
    yPosition += 10
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Generado el: ${new Date().toLocaleString('es-CL')}`, 20, yPosition)
    yPosition += 5
    pdf.text('Sistema: Vortexia v1.0', 20, yPosition)
    yPosition += 5
    pdf.text('Tipo: Reporte de Actividad', 20, yPosition)
    yPosition += 5
    pdf.text('Estado: Oficial', 20, yPosition)
    yPosition += 15
    
    // Footer
    pdf.setTextColor(...lightGray)
    pdf.setFontSize(9)
    pdf.text('(c) 2024 Vortexia - Sistema de Gestion de Ventas', 20, yPosition)
    yPosition += 4
    pdf.text('Documento confidencial - Solo para uso interno', 20, yPosition)
    
    // Descargar PDF
    pdf.save(`VORTEXIA-Reporte-${currentUser.name.replace(/\s+/g, '-')}-${report.fechaFormateada.replace(/\//g, '-')}.pdf`)
  }

  return (
    <div className="space-y-6 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-xl font-light text-gray-100 tracking-wide">Reports</h2>
          <p className="text-gray-500 text-base md:text-sm font-extralight">Gestiona tus reportes de actividad</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="hidden md:flex btn-primary"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span className="text-sm">Nuevo Reporte</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
        {reports.map((report) => (
          <div key={report.id} className="card animate-fade-in p-5 md:p-4">
            <div className="flex items-center justify-between mb-4 md:mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-8 md:h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 md:w-4 md:h-4 text-black" />
                </div>
                <div>
                  <h3 className="font-light text-gray-100 text-base md:text-sm">Reporte</h3>
                  <p className="text-sm md:text-xs text-gray-500 flex items-center font-light">
                    <Calendar className="w-4 h-4 md:w-3 md:h-3 mr-1" />
                    {report.fechaFormateada}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:space-y-1.5 mb-4 md:mb-3">
              <div className="flex justify-between text-sm md:text-xs">
                <span className="text-gray-500 font-light">Contactos:</span>
                <span className="font-light text-gray-200">{report.contactos}</span>
              </div>
              <div className="flex justify-between text-sm md:text-xs">
                <span className="text-gray-500 font-light">Mensajes:</span>
                <span className="font-light text-gray-200">{report.mensajesIniciales}</span>
              </div>
              <div className="flex justify-between text-sm md:text-xs">
                <span className="text-gray-500 font-light">Respuestas:</span>
                <span className="font-light text-gray-200">{report.respuestas}</span>
              </div>
              {isCEO && (
                <div className="flex justify-between text-sm md:text-xs">
                <span className="text-gray-500 font-light">Reuniones:</span>
                <span className="font-light text-gray-200">{report.reuniones}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2 md:space-x-1.5">
              <button
                onClick={() => handleView(report)}
                className="flex-1 flex items-center justify-center px-3 py-2.5 md:px-2 md:py-1.5 text-sm md:text-xs bg-gold-900/20 text-gold-400 rounded-md hover:bg-gold-900/30 transition-all duration-300 backdrop-blur-sm font-light min-h-[44px] md:min-h-auto"
              >
                <Eye className="w-4 h-4 md:w-3 md:h-3 mr-1" />
                Ver
              </button>
              <button
                onClick={() => handleDownload(report)}
                className="flex-1 flex items-center justify-center px-3 py-2.5 md:px-2 md:py-1.5 text-sm md:text-xs bg-green-900/20 text-green-400 rounded-md hover:bg-green-900/30 transition-all duration-300 backdrop-blur-sm font-light min-h-[44px] md:min-h-auto"
              >
                <Download className="w-4 h-4 md:w-3 md:h-3 mr-1" />
                Descargar
              </button>
              <button
                onClick={() => handleDelete(report.id)}
                className="flex items-center justify-center px-3 py-2.5 md:px-2 md:py-1.5 text-sm md:text-xs bg-red-900/20 text-red-400 rounded-md hover:bg-red-900/30 transition-all duration-300 backdrop-blur-sm min-h-[44px] md:min-h-auto"
              >
                <Trash2 className="w-4 h-4 md:w-3 md:h-3" />
              </button>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="col-span-full text-center py-12 md:py-8">
            <FileText className="w-16 h-16 md:w-12 md:h-12 text-gray-600 mx-auto mb-4 md:mb-3 opacity-50" />
            <h3 className="text-xl md:text-base font-light text-gray-200 mb-3 md:mb-2">No hay reportes</h3>
            <p className="text-gray-500 mb-4 md:mb-3 text-base md:text-sm font-extralight">Crea tu primer reporte para comenzar</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 md:w-4 md:h-4 mr-2 md:mr-1.5" />
              Crear Reporte
            </button>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="md:hidden fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-r from-gold-400 to-gold-600 text-black rounded-full shadow-2xl flex items-center justify-center z-30 animate-glow"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Report Modal */}
      {showModal && (
        <Modal
          title="Nuevo Reporte"
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Cantidad de Contactos
              </label>
              <input
                type="number"
                value={formData.contactos}
                onChange={(e) => setFormData({...formData, contactos: e.target.value})}
                className="input-field"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Mensajes Iniciales Enviados
              </label>
              <input
                type="number"
                value={formData.mensajesIniciales}
                onChange={(e) => setFormData({...formData, mensajesIniciales: e.target.value})}
                className="input-field"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Respuestas Recibidas
              </label>
              <input
                type="number"
                value={formData.respuestas}
                onChange={(e) => setFormData({...formData, respuestas: e.target.value})}
                className="input-field"
                min="0"
                required
              />
            </div>
            
            {isCEO && (
              <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Reuniones Agendadas
              </label>
              <input
                type="number"
                value={formData.reuniones}
                onChange={(e) => setFormData({...formData, reuniones: e.target.value})}
                className="input-field"
                min="0"
                required
              />
              </div>
            )}

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 pt-6 md:pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 btn-secondary order-2 md:order-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary order-1 md:order-2"
              >
                Guardar Reporte
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Report Modal */}
      {selectedReport && (
        <Modal
          title="Detalle del Reporte"
          onClose={() => setSelectedReport(null)}
        >
          <div className="space-y-5 md:space-y-4">
            <div className="text-center pb-5 md:pb-4 border-b border-dark-600">
              <h3 className="text-xl md:text-lg font-semibold text-gray-100">Reporte de Actividad</h3>
              <p className="text-base md:text-sm text-gray-400">{selectedReport.fechaFormateada}</p>
            </div>

            <div className="space-y-4 md:space-y-3">
              <div className="flex justify-between py-3 md:py-2 border-b border-dark-600">
                <span className="text-base md:text-sm text-gray-400">Contactos:</span>
                <span className="font-semibold text-base md:text-sm text-gray-200">{selectedReport.contactos}</span>
              </div>
              <div className="flex justify-between py-3 md:py-2 border-b border-dark-600">
                <span className="text-base md:text-sm text-gray-400">Mensajes Iniciales:</span>
                <span className="font-semibold text-base md:text-sm text-gray-200">{selectedReport.mensajesIniciales}</span>
              </div>
              <div className="flex justify-between py-3 md:py-2 border-b border-dark-600">
                <span className="text-base md:text-sm text-gray-400">Respuestas:</span>
                <span className="font-semibold text-base md:text-sm text-gray-200">{selectedReport.respuestas}</span>
              </div>
              {isCEO && (
                <div className="flex justify-between py-3 md:py-2 border-b border-dark-600">
                <span className="text-base md:text-sm text-gray-400">Reuniones Agendadas:</span>
                <span className="font-semibold text-base md:text-sm text-gray-200">{selectedReport.reuniones}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 pt-6 md:pt-4">
              <button
                onClick={() => handleDownload(selectedReport)}
                className="flex-1 btn-secondary order-2 md:order-1"
              >
                <Download className="w-5 h-5 md:w-4 md:h-4 mr-2" />
                Descargar
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 btn-primary order-1 md:order-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ReportsSection