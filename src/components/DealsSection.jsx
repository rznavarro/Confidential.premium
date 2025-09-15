import React, { useState } from 'react'
import { Plus, Eye, Download, Trash2, DollarSign, Calendar } from 'lucide-react'
import jsPDF from 'jspdf'
import Modal from './Modal'

const DealsSection = ({ deals, onDealsUpdate }) => {
  const currentUser = JSON.parse(localStorage.getItem('vortexia_user') || '{}')
  const isCEO = currentUser.level === 'ceo'

  const [showModal, setShowModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [formData, setFormData] = useState({
    facturacion: '',
    ganancia: '',
    gastos: '',
    ...(isCEO ? { ventas: '' } : { comision: '' })
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newDeal = {
      id: Date.now(),
      ...formData,
      facturacion: parseFloat(formData.facturacion) || 0,
      ganancia: parseFloat(formData.ganancia) || 0,
      gastos: parseFloat(formData.gastos) || 0,
      ...(isCEO ? 
        { ventas: parseInt(formData.ventas) || 0 } : 
        { 
          comision: parseFloat(formData.comision) || 0,
          gananciaNeta: (parseFloat(formData.ganancia) || 0) * (parseFloat(formData.comision) || 0) / 100
        }
      ),
      fecha: new Date().toISOString(),
      fechaFormateada: new Date().toLocaleDateString('es-CL')
    }

    onDealsUpdate([...deals, newDeal])
    setFormData({
      facturacion: '',
      ganancia: '',
      gastos: '',
      ...(isCEO ? { ventas: '' } : { comision: '' })
    })
    setShowModal(false)
  }

  const handleDelete = (dealId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este deal?')) {
      onDealsUpdate(deals.filter(deal => deal.id !== dealId))
    }
  }

  const handleView = (deal) => {
    setSelectedDeal(deal)
  }

  const handleDownload = (deal) => {
    const pdf = new jsPDF()
    
    const textColor = [55, 65, 81] // Gray-700
    const lightGray = [156, 163, 175] // Gray-400
    const greenColor = [34, 197, 94] // Green-500
    const redColor = [239, 68, 68] // Red-500
    
    let yPosition = 20
    
    // Título del documento
    pdf.setTextColor(...textColor)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('VORTEXIA - DEAL FINANCIERO', 20, yPosition)
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
    pdf.text(`Fecha del deal: ${deal.fechaFormateada}`, 20, yPosition)
    yPosition += 20
    
    // Información financiera
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('INFORMACION FINANCIERA', 20, yPosition)
    yPosition += 15
    
    // Facturación
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('FACTURACION TOTAL', 20, yPosition)
    yPosition += 8
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...greenColor)
    pdf.text(`Monto: ${formatCurrency(deal.facturacion)}`, 30, yPosition)
    yPosition += 12
    
    // Ganancia
    pdf.setTextColor(...textColor)
    pdf.setFont('helvetica', 'bold')
    pdf.text('GANANCIA BRUTA', 20, yPosition)
    yPosition += 8
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...primaryColor)
    pdf.text(`Monto: ${formatCurrency(deal.ganancia)}`, 30, yPosition)
    yPosition += 12
    
    // Gastos
    pdf.setTextColor(...textColor)
    pdf.setFont('helvetica', 'bold')
    pdf.text('GASTOS OPERACIONALES', 20, yPosition)
    yPosition += 8
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...redColor)
    pdf.text(`Monto: ${formatCurrency(deal.gastos)}`, 30, yPosition)
    yPosition += 12
    
    // Información específica por rol
    pdf.setTextColor(...textColor)
    if (isCEO) {
      // Cantidad de ventas
      pdf.setFont('helvetica', 'bold')
      pdf.text('CANTIDAD DE VENTAS', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Unidades: ${deal.ventas}`, 30, yPosition)
      yPosition += 6
      pdf.text(`Promedio por venta: ${deal.ventas > 0 ? formatCurrency(deal.facturacion / deal.ventas) : formatCurrency(0)}`, 30, yPosition)
      yPosition += 12
      
      // Ganancia neta empresa
      pdf.setFont('helvetica', 'bold')
      pdf.text('GANANCIA NETA EMPRESA', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      const gananciaNeta = deal.ganancia - deal.gastos
      pdf.setTextColor(gananciaNeta >= 0 ? greenColor : redColor)
      pdf.text(`Monto: ${formatCurrency(gananciaNeta)}`, 30, yPosition)
      yPosition += 6
      pdf.setTextColor(...textColor)
      pdf.text(`Margen: ${deal.facturacion > 0 ? Math.round((gananciaNeta / deal.facturacion) * 100) : 0}%`, 30, yPosition)
      yPosition += 15
    } else {
      // Comisión de venta
      pdf.setFont('helvetica', 'bold')
      pdf.text('COMISION DE VENTA', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Porcentaje: ${deal.comision}%`, 30, yPosition)
      yPosition += 6
      pdf.text(`Base de cálculo: ${formatCurrency(deal.ganancia)}`, 30, yPosition)
      yPosition += 12
      
      // Ganancia del empleado
      pdf.setFont('helvetica', 'bold')
      pdf.text('GANANCIA DEL EMPLEADO', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...greenColor)
      pdf.text(`Monto: ${formatCurrency(deal.gananciaNeta || 0)}`, 30, yPosition)
      yPosition += 6
      pdf.setTextColor(...textColor)
      pdf.text(`Sobre facturación: ${deal.facturacion > 0 ? Math.round(((deal.gananciaNeta || 0) / deal.facturacion) * 100) : 0}%`, 30, yPosition)
      yPosition += 15
    }
    
    // Análisis financiero
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('ANALISIS FINANCIERO', 20, yPosition)
    yPosition += 15
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`- Margen bruto: ${deal.facturacion > 0 ? Math.round((deal.ganancia / deal.facturacion) * 100) : 0}%`, 20, yPosition)
    yPosition += 6
    pdf.text(`- Ratio gastos: ${deal.facturacion > 0 ? Math.round((deal.gastos / deal.facturacion) * 100) : 0}%`, 20, yPosition)
    yPosition += 6
    
    if (isCEO) {
      pdf.text(`- ROI: ${deal.gastos > 0 ? Math.round(((deal.ganancia - deal.gastos) / deal.gastos) * 100) : 0}%`, 20, yPosition)
    } else {
      pdf.text(`- Efectividad comision: ${deal.ganancia > 0 ? Math.round(((deal.gananciaNeta || 0) / deal.ganancia) * 100) : 0}%`, 20, yPosition)
    }
    yPosition += 15
    
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
    pdf.text('Tipo: Deal Financiero', 20, yPosition)
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
    pdf.save(`VORTEXIA-Deal-${currentUser.name.replace(/\s+/g, '-')}-${deal.fechaFormateada.replace(/\//g, '-')}.pdf`)
  }

  return (
    <div className="space-y-6 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-xl font-light text-gray-100 tracking-wide">Deals</h2>
          <p className="text-gray-500 text-base md:text-sm font-extralight">Gestiona tus deals financieros</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="hidden md:flex btn-primary"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span className="text-sm">Nuevo Deal</span>
        </button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
        {deals.map((deal) => (
          <div key={deal.id} className="card animate-fade-in p-5 md:p-4">
            <div className="flex items-center justify-between mb-4 md:mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <DollarSign className="w-5 h-5 md:w-4 md:h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-light text-gray-100 text-base md:text-sm">Deal</h3>
                  <p className="text-sm md:text-xs text-gray-500 flex items-center font-light">
                    <Calendar className="w-4 h-4 md:w-3 md:h-3 mr-1" />
                    {deal.fechaFormateada}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:space-y-1.5 mb-4 md:mb-3">
              <div className="flex justify-between text-sm md:text-xs">
                <span className="text-gray-500 font-light">Facturación:</span>
                <span className="font-light text-green-400">{formatCurrency(deal.facturacion)}</span>
              </div>
              <div className="flex justify-between text-sm md:text-xs">
                <span className="text-gray-500 font-light">Ganancia:</span>
                <span className="font-light text-gold-400">{formatCurrency(deal.ganancia)}</span>
              </div>
              <div className="flex justify-between text-sm md:text-xs">
                <span className="text-gray-500 font-light">Gastos:</span>
                <span className="font-light text-red-400">{formatCurrency(deal.gastos)}</span>
              </div>
              {isCEO ? (
                <div className="flex justify-between text-sm md:text-xs">
                  <span className="text-gray-500 font-light">Ventas:</span>
                  <span className="font-light text-gray-200">{deal.ventas}</span>
                </div>
              ) : (
                <div className="flex justify-between text-sm md:text-xs">
                  <span className="text-gray-500 font-light">Comisión:</span>
                  <span className="font-light text-blue-400">{deal.comision}%</span>
                </div>
              )}
              <div className="flex justify-between text-sm md:text-xs pt-3 md:pt-2 border-t border-dark-700/30">
                <span className="text-gray-500 font-light">{isCEO ? 'Neto:' : 'Mi Ganancia:'}</span>
                <span className={`font-light ${
                  isCEO ? 
                    (deal.ganancia - deal.gastos >= 0 ? 'text-green-400' : 'text-red-400') :
                    'text-green-400'
                }`}>
                  {isCEO ? 
                    formatCurrency(deal.ganancia - deal.gastos) :
                    formatCurrency(deal.gananciaNeta || 0)
                  }
                </span>
              </div>
            </div>

            <div className="flex space-x-2 md:space-x-1.5">
              <button
                onClick={() => handleView(deal)}
                className="flex-1 flex items-center justify-center px-3 py-2.5 md:px-2 md:py-1.5 text-sm md:text-xs bg-gold-900/20 text-gold-400 rounded-md hover:bg-gold-900/30 transition-all duration-300 backdrop-blur-sm font-light min-h-[44px] md:min-h-auto"
              >
                <Eye className="w-4 h-4 md:w-3 md:h-3 mr-1" />
                Ver
              </button>
              <button
                onClick={() => handleDownload(deal)}
                className="flex-1 flex items-center justify-center px-3 py-2.5 md:px-3 md:py-2 text-sm bg-green-900/20 text-green-400 rounded-lg hover:bg-green-900/30 transition-colors min-h-[44px] md:min-h-auto"
              >
                <Download className="w-5 h-5 md:w-4 md:h-4 mr-1" />
                Descargar
              </button>
              <button
                onClick={() => handleDelete(deal.id)}
                className="flex items-center justify-center px-3 py-2.5 md:px-3 md:py-2 text-sm bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors min-h-[44px] md:min-h-auto"
              >
                <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        ))}

        {deals.length === 0 && (
          <div className="col-span-full text-center py-16 md:py-12">
            <DollarSign className="w-20 h-20 md:w-16 md:h-16 text-gray-600 mx-auto mb-5 md:mb-4" />
            <h3 className="text-xl md:text-lg font-medium text-gray-200 mb-3 md:mb-2">No hay deals</h3>
            <p className="text-base md:text-sm text-gray-400 mb-5 md:mb-4">Crea tu primer deal para comenzar</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="w-6 h-6 md:w-5 md:h-5 mr-2" />
              Crear Deal
            </button>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="md:hidden fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center z-30 animate-glow"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Deal Modal */}
      {showModal && (
        <Modal
          title="Nuevo Deal"
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Facturación ($)
              </label>
              <input
                type="number"
                value={formData.facturacion}
                onChange={(e) => setFormData({...formData, facturacion: e.target.value})}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ganancia ($)
              </label>
              <input
                type="number"
                value={formData.ganancia}
                onChange={(e) => setFormData({...formData, ganancia: e.target.value})}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gastos ($)
              </label>
              <input
                type="number"
                value={formData.gastos}
                onChange={(e) => setFormData({...formData, gastos: e.target.value})}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isCEO ? 'Cantidad de Ventas' : 'Comisión de Venta (%)'}
              </label>
              <input
                type="number" 
                value={isCEO ? formData.ventas : formData.comision}
                onChange={(e) => setFormData({
                  ...formData, 
                  ...(isCEO ? { ventas: e.target.value } : { comision: e.target.value })
                })}
                className="input-field"
                min="0"
                step={isCEO ? "1" : "0.01"}
                max={isCEO ? undefined : "100"}
                placeholder={isCEO ? "Ej: 5" : "Ej: 20"}
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
              >
                Guardar Deal
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Deal Modal */}
      {selectedDeal && (
        <Modal
          title="Detalle del Deal"
          onClose={() => setSelectedDeal(null)}
        >
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-dark-600">
              <h3 className="text-lg font-semibold text-gray-100">Deal Financiero</h3>
              <p className="text-gray-400">{selectedDeal.fechaFormateada}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-dark-600">
                <span className="text-gray-400">Facturación:</span>
                <span className="font-semibold text-green-600">{formatCurrency(selectedDeal.facturacion)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dark-600">
                <span className="text-gray-400">Ganancia:</span>
                <span className="font-semibold text-gold-400">{formatCurrency(selectedDeal.ganancia)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dark-600">
                <span className="text-gray-400">Gastos:</span>
                <span className="font-semibold text-red-600">{formatCurrency(selectedDeal.gastos)}</span>
              </div>
              {isCEO ? (
                <div className="flex justify-between py-2 border-b border-dark-600">
                  <span className="text-gray-400">Cantidad de Ventas:</span>
                  <span className="font-semibold text-gray-200">{selectedDeal.ventas}</span>
                </div>
              ) : (
                <div className="flex justify-between py-2 border-b border-dark-600">
                  <span className="text-gray-400">Comisión:</span>
                  <span className="font-semibold text-blue-400">{selectedDeal.comision}%</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-dark-600">
                <span className="text-gray-200 font-bold">{isCEO ? 'Ganancia Neta:' : 'Mi Ganancia:'}</span>
                <span className={`font-bold text-lg ${
                  isCEO ? 
                    (selectedDeal.ganancia - selectedDeal.gastos >= 0 ? 'text-green-600' : 'text-red-600') :
                    'text-green-600'
                }`}>
                  {isCEO ? 
                    formatCurrency(selectedDeal.ganancia - selectedDeal.gastos) :
                    formatCurrency(selectedDeal.gananciaNeta || 0)
                  }
                </span>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => handleDownload(selectedDeal)}
                className="flex-1 btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </button>
              <button
                onClick={() => setSelectedDeal(null)}
                className="flex-1 btn-primary"
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

export default DealsSection