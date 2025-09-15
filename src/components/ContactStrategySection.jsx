import React, { useState } from 'react'
import { Plus, Eye, Download, Edit, Trash2, Target, User, MessageSquare, Users } from 'lucide-react'
import jsPDF from 'jspdf'
import Modal from './Modal'
import { employeeDatabase } from '../data/employees'

const ContactStrategySection = ({ strategies, onStrategiesUpdate }) => {
  const currentUser = JSON.parse(localStorage.getItem('vortexia_user') || '{}')
  const isCEO = currentUser.level === 'ceo'

  const [showModal, setShowModal] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState(null)
  const [editingStrategy, setEditingStrategy] = useState(null)
  const [formData, setFormData] = useState({
    empleadoAsignado: '',
    nicho: '',
    mensajeInicial: '',
    mensajeRespuestaPositiva: '',
    mensajeRespuestaNegativa: '',
    preguntasCualificacion: '',
    criteriosCalificacion: '',
    followUpDia2: '',
    followUpDia7: '',
    scriptTransferencia: '',
    instruccionesEquipo: '',
    notasAdicionales: ''
  })

  // Filtrar empleados (excluir CEO)
  const availableEmployees = employeeDatabase.filter(emp => emp.level !== 'ceo')

  // Obtener estrategias según el rol
  const getVisibleStrategies = () => {
    if (isCEO) {
      return strategies
    } else {
      return strategies.filter(strategy => strategy.empleadoAsignado === currentUser.code)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const empleado = employeeDatabase.find(emp => emp.code === formData.empleadoAsignado)
    
    const strategyData = {
      ...formData,
      empleadoNombre: empleado?.name || '',
      fechaCreacion: editingStrategy ? editingStrategy.fechaCreacion : new Date().toISOString(),
      fechaCreacionFormateada: editingStrategy ? editingStrategy.fechaCreacionFormateada : new Date().toLocaleDateString('es-CL'),
      fechaActualizacion: new Date().toISOString(),
      fechaActualizacionFormateada: new Date().toLocaleDateString('es-CL')
    }

    if (editingStrategy) {
      const updatedStrategies = strategies.map(strategy => 
        strategy.id === editingStrategy.id ? { ...strategyData, id: editingStrategy.id } : strategy
      )
      onStrategiesUpdate(updatedStrategies)
    } else {
      const newStrategy = {
        id: Date.now(),
        ...strategyData
      }
      onStrategiesUpdate([...strategies, newStrategy])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      empleadoAsignado: '',
      nicho: '',
      mensajeInicial: '',
      mensajeRespuestaPositiva: '',
      mensajeRespuestaNegativa: '',
      preguntasCualificacion: '',
      criteriosCalificacion: '',
      followUpDia2: '',
      followUpDia7: '',
      scriptTransferencia: '',
      instruccionesEquipo: '',
      notasAdicionales: ''
    })
    setShowModal(false)
    setEditingStrategy(null)
  }

  const handleEdit = (strategy) => {
    setEditingStrategy(strategy)
    setFormData({
      empleadoAsignado: strategy.empleadoAsignado,
      nicho: strategy.nicho,
      mensajeInicial: strategy.mensajeInicial,
      mensajeRespuestaPositiva: strategy.mensajeRespuestaPositiva,
      mensajeRespuestaNegativa: strategy.mensajeRespuestaNegativa,
      preguntasCualificacion: strategy.preguntasCualificacion,
      criteriosCalificacion: strategy.criteriosCalificacion,
      followUpDia2: strategy.followUpDia2,
      followUpDia7: strategy.followUpDia7,
      scriptTransferencia: strategy.scriptTransferencia,
      instruccionesEquipo: strategy.instruccionesEquipo,
      notasAdicionales: strategy.notasAdicionales || ''
    })
    setShowModal(true)
  }

  const handleDelete = (strategyId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta estrategia?')) {
      onStrategiesUpdate(strategies.filter(strategy => strategy.id !== strategyId))
    }
  }

  const handleView = (strategy) => {
    setSelectedStrategy(strategy)
  }

  const handleDownloadPDF = (strategy) => {
    const pdf = new jsPDF()
    
    try {
      const textColor = [55, 65, 81] // Gray-700
      const lightGray = [156, 163, 175] // Gray-400
      const goldColor = [245, 158, 11] // Gold-500
    
      let yPosition = 20
    
      // Header con logo
      pdf.setTextColor(...goldColor)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('VORTEXIA', 20, yPosition)
    
      pdf.setTextColor(...lightGray)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text('CONFIDENTIAL', 120, yPosition)
      yPosition += 15
    
      // Título del documento
      pdf.setTextColor(...textColor)
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text('ESTRATEGIA DE CONTACTO', 20, yPosition)
      yPosition += 20
    
      // Información del empleado
      const empleado = employeeDatabase.find(emp => emp.code === strategy.empleadoAsignado)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('INFORMACION DEL EMPLEADO', 20, yPosition)
      yPosition += 10
    
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Empleado: ${strategy.empleadoNombre || 'N/A'} (${strategy.empleadoAsignado || 'N/A'})`, 20, yPosition)
      yPosition += 6
      pdf.text(`Rol: ${empleado?.role || 'N/A'}`, 20, yPosition)
      yPosition += 6
      pdf.text(`Equipo: ${empleado?.team || 'N/A'}`, 20, yPosition)
      yPosition += 6
      pdf.text(`Fecha de creacion: ${strategy.fechaCreacionFormateada || 'N/A'}`, 20, yPosition)
      yPosition += 6
      pdf.text(`Ultima actualizacion: ${strategy.fechaActualizacionFormateada || 'N/A'}`, 20, yPosition)
      yPosition += 20
    
      // Estrategia de ventas
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('ESTRATEGIA DE VENTAS', 20, yPosition)
      yPosition += 15
    
      // Nicho objetivo
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...goldColor)
      pdf.text('NICHO OBJETIVO', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const nichoText = strategy.nicho || 'No especificado'
      const nichoLines = pdf.splitTextToSize(nichoText, 170)
      pdf.text(nichoLines, 20, yPosition)
      yPosition += nichoLines.length * 6 + 10
    
      // Mensaje inicial
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(59, 130, 246) // Blue
      pdf.text('MENSAJE INICIAL', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const mensajeText = strategy.mensajeInicial || 'No especificado'
      const mensajeLines = pdf.splitTextToSize(mensajeText, 170)
      pdf.text(mensajeLines, 20, yPosition)
      yPosition += mensajeLines.length * 6 + 10
    
      // Verificar si necesitamos nueva página
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }
    
      // Mensaje respuesta positiva
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(34, 197, 94) // Green
      pdf.text('MENSAJE PARA RESPUESTA POSITIVA', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const positivaText = strategy.mensajeRespuestaPositiva || 'No especificado'
      const positivaLines = pdf.splitTextToSize(positivaText, 170)
      pdf.text(positivaLines, 20, yPosition)
      yPosition += positivaLines.length * 6 + 10
    
      // Mensaje respuesta negativa
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(239, 68, 68) // Red
      pdf.text('MENSAJE PARA RESPUESTA NEGATIVA', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const negativaText = strategy.mensajeRespuestaNegativa || 'No especificado'
      const negativaLines = pdf.splitTextToSize(negativaText, 170)
      pdf.text(negativaLines, 20, yPosition)
      yPosition += negativaLines.length * 6 + 10
    
      // Verificar si necesitamos nueva página
      if (yPosition > 220) {
        pdf.addPage()
        yPosition = 20
      }
    
      // Preguntas de cualificación
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...goldColor)
      pdf.text('PREGUNTAS DE CUALIFICACION', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const preguntasText = strategy.preguntasCualificacion || 'No especificado'
      const preguntasLines = pdf.splitTextToSize(preguntasText, 170)
      pdf.text(preguntasLines, 20, yPosition)
      yPosition += preguntasLines.length * 6 + 10
    
      // Criterios de cualificación
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(6, 182, 212) // Cyan
      pdf.text('CRITERIOS DE CUALIFICACION', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const criteriosText = strategy.criteriosCalificacion || 'No especificado'
      const criteriosLines = pdf.splitTextToSize(criteriosText, 170)
      pdf.text(criteriosLines, 20, yPosition)
      yPosition += criteriosLines.length * 6 + 10
    
      // Verificar si necesitamos nueva página
      if (yPosition > 220) {
        pdf.addPage()
        yPosition = 20
      }
    
      // Follow-up día 2
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(249, 115, 22) // Orange
      pdf.text('FOLLOW-UP DIA 2-3', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const followUp2Text = strategy.followUpDia2 || 'No especificado'
      const followUp2Lines = pdf.splitTextToSize(followUp2Text, 170)
      pdf.text(followUp2Lines, 20, yPosition)
      yPosition += followUp2Lines.length * 6 + 10
    
      // Follow-up día 7
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(236, 72, 153) // Pink
      pdf.text('FOLLOW-UP DIA 7 (FINAL)', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const followUp7Text = strategy.followUpDia7 || 'No especificado'
      const followUp7Lines = pdf.splitTextToSize(followUp7Text, 170)
      pdf.text(followUp7Lines, 20, yPosition)
      yPosition += followUp7Lines.length * 6 + 10
    
      // Verificar si necesitamos nueva página
      if (yPosition > 220) {
        pdf.addPage()
        yPosition = 20
      }
    
      // Script de transferencia
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(99, 102, 241) // Indigo
      pdf.text('SCRIPT DE TRANSFERENCIA', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const scriptText = strategy.scriptTransferencia || 'No especificado'
      const scriptLines = pdf.splitTextToSize(scriptText, 170)
      pdf.text(scriptLines, 20, yPosition)
      yPosition += scriptLines.length * 6 + 10
    
      // Instrucciones para el equipo
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(20, 184, 166) // Teal
      pdf.text('INSTRUCCIONES PARA EL EQUIPO', 20, yPosition)
      yPosition += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...textColor)
      const instruccionesText = strategy.instruccionesEquipo || 'No especificado'
      const instruccionesLines = pdf.splitTextToSize(instruccionesText, 170)
      pdf.text(instruccionesLines, 20, yPosition)
      yPosition += instruccionesLines.length * 6 + 10
    
      // Notas adicionales (si existen)
      if (strategy.notasAdicionales && strategy.notasAdicionales.trim()) {
        // Verificar si necesitamos nueva página
        if (yPosition > 200) {
          pdf.addPage()
          yPosition = 20
        }
        
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(...lightGray)
        pdf.text('NOTAS ADICIONALES', 20, yPosition)
        yPosition += 8
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(...textColor)
        const notasLines = pdf.splitTextToSize(strategy.notasAdicionales, 170)
        pdf.text(notasLines, 20, yPosition)
        yPosition += notasLines.length * 6 + 15
      }
      
      // Verificar si necesitamos nueva página para el footer
      if (yPosition > 240) {
        pdf.addPage()
        yPosition = 20
      }
      
      // Información del documento
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...textColor)
      pdf.text('INFORMACION DEL DOCUMENTO', 20, yPosition)
      yPosition += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Generado el: ${new Date().toLocaleString('es-CL')}`, 20, yPosition)
      yPosition += 5
      pdf.text('Sistema: Vortexia v1.0', 20, yPosition)
      yPosition += 5
      pdf.text('Tipo: Estrategia de Contacto', 20, yPosition)
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
      const employeeName = (strategy.empleadoNombre || 'Usuario').replace(/\s+/g, '-')
      const date = (strategy.fechaCreacionFormateada || new Date().toLocaleDateString('es-CL')).replace(/\//g, '-')
      const fileName = `VORTEXIA-Estrategia-${employeeName}-${date}.pdf`
      pdf.save(fileName)
      
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor intenta nuevamente.')
    }
  }


  const visibleStrategies = getVisibleStrategies()

  return (
    <div className="space-y-6 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-xl font-light text-gray-100 tracking-wide">Estrategia de Contacto</h2>
          <p className="text-gray-500 text-base md:text-sm font-extralight">
            {isCEO ? 'Define estrategias personalizadas para tu equipo' : 'Tu estrategia de ventas personalizada'}
          </p>
        </div>
        {isCEO && (
          <button
            onClick={() => setShowModal(true)}
            className="hidden md:flex btn-primary"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span className="text-sm">Nueva Estrategia</span>
          </button>
        )}
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-4">
        {visibleStrategies.map((strategy) => (
          <div key={strategy.id} className="card animate-fade-in p-5 md:p-4">
            <div className="flex items-center justify-between mb-4 md:mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-8 md:h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 md:w-4 md:h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-light text-gray-100 text-base md:text-sm">{strategy.empleadoNombre}</h3>
                  <p className="text-sm md:text-xs text-gray-500 font-light">Estrategia de Contacto</p>
                </div>
              </div>
              {isCEO && (
                <div className="flex space-x-2 md:space-x-1">
                  <button
                    onClick={() => handleEdit(strategy)}
                    className="p-2.5 md:p-1.5 text-gray-500 hover:text-gold-400 transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center rounded-lg"
                  >
                    <Edit className="w-4 h-4 md:w-3 md:h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(strategy.id)}
                    className="p-2.5 md:p-1.5 text-gray-500 hover:text-red-400 transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 md:w-3 md:h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 md:space-y-2 mb-4 md:mb-3">
              <div className="bg-dark-800/30 rounded-lg p-3 md:p-2 border border-dark-700/30">
                <p className="text-xs text-gray-500 font-light mb-1">Nicho:</p>
                <p className="text-sm md:text-xs text-gray-200 font-light line-clamp-2">{strategy.nicho}</p>
              </div>
              
              <div className="bg-dark-800/30 rounded-lg p-3 md:p-2 border border-dark-700/30">
                <p className="text-xs text-gray-500 font-light mb-1">Mensaje Inicial:</p>
                <p className="text-sm md:text-xs text-gray-200 font-light line-clamp-3">{strategy.mensajeInicial}</p>
              </div>

              <div className="flex justify-between text-sm md:text-xs">
                <span className="text-gray-500 font-light">Creado:</span>
                <span className="font-light text-gray-200">{strategy.fechaCreacionFormateada}</span>
              </div>
              <div className="flex justify-between text-sm md:text-xs">
                <span className="text-gray-500 font-light">Actualizado:</span>
                <span className="font-light text-gray-200">{strategy.fechaActualizacionFormateada}</span>
              </div>
            </div>

            <div className="flex space-x-2 md:space-x-1.5">
              <button
                onClick={() => handleView(strategy)}
                className="flex-1 flex items-center justify-center px-3 py-2.5 md:px-2 md:py-1.5 text-sm md:text-xs bg-purple-900/20 text-purple-400 rounded-md hover:bg-purple-900/30 transition-all duration-300 backdrop-blur-sm font-light min-h-[44px] md:min-h-auto"
              >
                <Eye className="w-4 h-4 md:w-3 md:h-3 mr-1" />
                Ver
              </button>
              <button
                onClick={() => handleDownloadPDF(strategy)}
                className="flex-1 flex items-center justify-center px-3 py-2.5 md:px-2 md:py-1.5 text-sm md:text-xs bg-green-900/20 text-green-400 rounded-md hover:bg-green-900/30 transition-all duration-300 backdrop-blur-sm font-light min-h-[44px] md:min-h-auto"
              >
                <Download className="w-4 h-4 md:w-3 md:h-3 mr-1" />
                PDF
              </button>
            </div>
          </div>
        ))}

        {visibleStrategies.length === 0 && (
          <div className="col-span-full text-center py-16 md:py-12">
            <Target className="w-20 h-20 md:w-16 md:h-16 text-gray-600 mx-auto mb-5 md:mb-4 opacity-50" />
            <h3 className="text-xl md:text-lg font-light text-gray-200 mb-3 md:mb-2">
              {isCEO ? 'No hay estrategias definidas' : 'No tienes estrategia asignada'}
            </h3>
            <p className="text-gray-500 mb-4 md:mb-3 text-base md:text-sm font-extralight">
              {isCEO ? 'Crea la primera estrategia para tu equipo' : 'El CEO aún no te ha asignado una estrategia'}
            </p>
            {isCEO && (
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5 md:w-4 md:h-4 mr-2 md:mr-1.5" />
                Crear Estrategia
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile FAB - Solo para CEO */}
      {isCEO && (
        <button
          onClick={() => setShowModal(true)}
          className="md:hidden fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center z-30 animate-glow"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Create/Edit Strategy Modal - Solo para CEO */}
      {isCEO && showModal && (
        <Modal
          title={editingStrategy ? 'Editar Estrategia' : 'Nueva Estrategia'}
          onClose={resetForm}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Empleado Asignado *
              </label>
              <select
                value={formData.empleadoAsignado}
                onChange={(e) => setFormData({...formData, empleadoAsignado: e.target.value})}
                className="input-field"
                required
              >
                <option value="">Seleccionar empleado...</option>
                {availableEmployees.map(emp => (
                  <option key={emp.code} value={emp.code}>
                    {emp.name} - {emp.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Nicho Objetivo *
              </label>
              <textarea
                value={formData.nicho}
                onChange={(e) => setFormData({...formData, nicho: e.target.value})}
                className="input-field min-h-[80px] resize-none"
                placeholder="Ej: Empresas de tecnología con 10-50 empleados en Santiago"
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Mensaje Inicial *
              </label>
              <textarea
                value={formData.mensajeInicial}
                onChange={(e) => setFormData({...formData, mensajeInicial: e.target.value})}
                className="input-field min-h-[100px] resize-none"
                placeholder="Mensaje de primer contacto..."
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Mensaje para Respuesta Positiva *
              </label>
              <textarea
                value={formData.mensajeRespuestaPositiva}
                onChange={(e) => setFormData({...formData, mensajeRespuestaPositiva: e.target.value})}
                className="input-field min-h-[100px] resize-none"
                placeholder="Mensaje cuando el cliente muestra interés..."
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Mensaje para Respuesta Negativa *
              </label>
              <textarea
                value={formData.mensajeRespuestaNegativa}
                onChange={(e) => setFormData({...formData, mensajeRespuestaNegativa: e.target.value})}
                className="input-field min-h-[100px] resize-none"
                placeholder="Mensaje cuando el cliente no está interesado..."
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Preguntas de Cualificación *
              </label>
              <textarea
                value={formData.preguntasCualificacion}
                onChange={(e) => setFormData({...formData, preguntasCualificacion: e.target.value})}
                className="input-field min-h-[120px] resize-none"
                placeholder="Ej: ¿Cuántos leads manejas al mes? ¿Qué facturación anual tiene tu empresa? ¿Tienes equipo de ventas?"
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Criterios de Cualificación *
              </label>
              <textarea
                value={formData.criteriosCalificacion}
                onChange={(e) => setFormData({...formData, criteriosCalificacion: e.target.value})}
                className="input-field min-h-[100px] resize-none"
                placeholder="Ej: 50+ leads/mes O $200K+ facturación anual. Debe tener equipo de ventas..."
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Follow-up Día 2-3 *
              </label>
              <textarea
                value={formData.followUpDia2}
                onChange={(e) => setFormData({...formData, followUpDia2: e.target.value})}
                className="input-field min-h-[100px] resize-none"
                placeholder="Mensaje de seguimiento para el día 2-3 si no responden..."
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Follow-up Día 7 (Final) *
              </label>
              <textarea
                value={formData.followUpDia7}
                onChange={(e) => setFormData({...formData, followUpDia7: e.target.value})}
                className="input-field min-h-[100px] resize-none"
                placeholder="Mensaje final de seguimiento para el día 7..."
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Script de Transferencia *
              </label>
              <textarea
                value={formData.scriptTransferencia}
                onChange={(e) => setFormData({...formData, scriptTransferencia: e.target.value})}
                className="input-field min-h-[120px] resize-none"
                placeholder="Script para transferir leads calificados al CEO. Incluye qué información pasar..."
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Instrucciones para el Equipo *
              </label>
              <textarea
                value={formData.instruccionesEquipo}
                onChange={(e) => setFormData({...formData, instruccionesEquipo: e.target.value})}
                className="input-field min-h-[120px] resize-none"
                placeholder="Qué DEBEN hacer y qué NO deben hacer. Reglas claras para el equipo..."
                required
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={formData.notasAdicionales}
                onChange={(e) => setFormData({...formData, notasAdicionales: e.target.value})}
                className="input-field min-h-[80px] resize-none"
                placeholder="Información adicional, tips, consideraciones especiales..."
              />
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 pt-6 md:pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 btn-secondary order-2 md:order-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary order-1 md:order-2"
              >
                {editingStrategy ? 'Actualizar Estrategia' : 'Crear Estrategia'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Strategy Modal */}
      {selectedStrategy && (
        <Modal
          title="Estrategia de Contacto"
          onClose={() => setSelectedStrategy(null)}
        >
          <div className="space-y-5 md:space-y-4">
            <div className="text-center pb-5 md:pb-4 border-b border-dark-600">
              <h3 className="text-xl md:text-lg font-semibold text-gray-100">{selectedStrategy.empleadoNombre}</h3>
              <p className="text-base md:text-sm text-gray-400">Estrategia de Ventas Personalizada</p>
            </div>

            <div className="space-y-4 md:space-y-3">
              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-purple-400 mb-2 md:mb-1.5 flex items-center">
                  <Target className="w-4 h-4 md:w-3 md:h-3 mr-1.5" />
                  Nicho Objetivo
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed">{selectedStrategy.nicho}</p>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-blue-400 mb-2 md:mb-1.5 flex items-center">
                  <MessageSquare className="w-4 h-4 md:w-3 md:h-3 mr-1.5" />
                  Mensaje Inicial
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed">{selectedStrategy.mensajeInicial}</p>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-green-400 mb-2 md:mb-1.5">
                  ✅ Respuesta Positiva
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed">{selectedStrategy.mensajeRespuestaPositiva}</p>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-red-400 mb-2 md:mb-1.5">
                  ❌ Respuesta Negativa
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed">{selectedStrategy.mensajeRespuestaNegativa}</p>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-gold-400 mb-2 md:mb-1.5">
                  ❓ Preguntas de Cualificación
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed whitespace-pre-line">{selectedStrategy.preguntasCualificacion}</p>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-cyan-400 mb-2 md:mb-1.5">
                  ✅ Criterios de Cualificación
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed whitespace-pre-line">{selectedStrategy.criteriosCalificacion}</p>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-orange-400 mb-2 md:mb-1.5">
                  📅 Follow-up Día 2-3
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed whitespace-pre-line">{selectedStrategy.followUpDia2}</p>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-pink-400 mb-2 md:mb-1.5">
                  📅 Follow-up Día 7 (Final)
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed whitespace-pre-line">{selectedStrategy.followUpDia7}</p>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-indigo-400 mb-2 md:mb-1.5">
                  🔄 Script de Transferencia
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed whitespace-pre-line">{selectedStrategy.scriptTransferencia}</p>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-teal-400 mb-2 md:mb-1.5">
                  📋 Instrucciones para el Equipo
                </h4>
                <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed whitespace-pre-line">{selectedStrategy.instruccionesEquipo}</p>
              </div>

              {selectedStrategy.notasAdicionales && (
                <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                  <h4 className="text-base md:text-sm font-medium text-gray-400 mb-2 md:mb-1.5">
                    📝 Notas Adicionales
                  </h4>
                  <p className="text-base md:text-sm text-gray-200 font-light leading-relaxed whitespace-pre-line">{selectedStrategy.notasAdicionales}</p>
                </div>
              )}

              <div className="flex justify-between text-sm md:text-xs text-gray-500 pt-3 md:pt-2 border-t border-dark-700/30">
                <span>Creado: {selectedStrategy.fechaCreacionFormateada}</span>
                <span>Actualizado: {selectedStrategy.fechaActualizacionFormateada}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 pt-6 md:pt-4">
              <button
                onClick={() => handleDownloadPDF(selectedStrategy)}
                className="flex-1 btn-secondary order-2 md:order-1"
              >
                <Download className="w-5 h-5 md:w-4 md:h-4 mr-2" />
                Descargar PDF
              </button>
              <button
                onClick={() => setSelectedStrategy(null)}
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

export default ContactStrategySection