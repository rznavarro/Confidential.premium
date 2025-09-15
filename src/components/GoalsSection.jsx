import React, { useState } from 'react'
import { Plus, Target, Calendar, User, Edit, Trash2 } from 'lucide-react'
import Modal from './Modal'

const GoalsSection = ({ goals, onGoalsUpdate, metrics }) => {
  const currentUser = JSON.parse(localStorage.getItem('vortexia_user') || '{}')
  const isCEO = currentUser.level === 'ceo'

  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'ventas',
    objetivo: '',
    fechaLimite: '',
    asignadoA: ''
  })

  const goalTypes = [
    { value: 'ventas', label: 'Meta de Ventas', metric: 'ventas' },
    { value: 'facturacion', label: 'Meta de Facturación', metric: 'facturacion' },
    ...(isCEO ? [{ value: 'contactos', label: 'Meta de Contactos', metric: 'contactos' }] : []),
    { value: 'reuniones', label: 'Meta de Reuniones', metric: 'reuniones' }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CL').format(number)
  }

  const calculateProgress = (goal) => {
    const currentValue = metrics[goal.tipo] || 0
    const progress = (currentValue / goal.objetivo) * 100
    return Math.min(progress, 100)
  }

  const getGoalStatus = (goal) => {
    const progress = calculateProgress(goal)
    const today = new Date()
    const deadline = new Date(goal.fechaLimite)
    
    if (progress >= 100) return 'completada'
    if (today > deadline) return 'atrasada'
    return 'en-progreso'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada': return 'text-green-600 bg-green-100'
      case 'atrasada': return 'text-red-600 bg-red-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completada': return 'Completada'
      case 'atrasada': return 'Atrasada'
      default: return 'En Progreso'
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const goalData = {
      ...formData,
      objetivo: parseFloat(formData.objetivo) || 0,
      fechaCreacion: editingGoal ? editingGoal.fechaCreacion : new Date().toISOString(),
      fechaCreacionFormateada: editingGoal ? editingGoal.fechaCreacionFormateada : new Date().toLocaleDateString('es-CL')
    }

    if (editingGoal) {
      const updatedGoals = goals.map(goal => 
        goal.id === editingGoal.id ? { ...goalData, id: editingGoal.id } : goal
      )
      onGoalsUpdate(updatedGoals)
    } else {
      const newGoal = {
        id: Date.now(),
        ...goalData
      }
      onGoalsUpdate([...goals, newGoal])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: 'ventas',
      objetivo: '',
      fechaLimite: '',
      asignadoA: ''
    })
    setShowModal(false)
    setEditingGoal(null)
  }

  const handleEdit = (goal) => {
    setEditingGoal(goal)
    setFormData({
      nombre: goal.nombre,
      tipo: goal.tipo,
      objetivo: goal.objetivo.toString(),
      fechaLimite: goal.fechaLimite,
      asignadoA: goal.asignadoA
    })
    setShowModal(true)
  }

  const handleDelete = (goalId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta meta?')) {
      onGoalsUpdate(goals.filter(goal => goal.id !== goalId))
    }
  }

  return (
    <div className="space-y-6 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-xl font-light text-gray-100 tracking-wide">Metas de Ventas</h2>
          <p className="text-gray-500 text-base md:text-sm font-extralight">Gestiona y monitorea tus objetivos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="hidden md:flex btn-primary"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span className="text-sm">Nueva Meta</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-4">
        {goals.map((goal) => {
          const progress = calculateProgress(goal)
          const status = getGoalStatus(goal)
          const goalType = goalTypes.find(type => type.value === goal.tipo)
          const currentValue = metrics[goal.tipo] || 0
          
          return (
            <div key={goal.id} className="card animate-fade-in p-5 md:p-4">
              <div className="flex items-center justify-between mb-4 md:mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-8 md:h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 md:w-4 md:h-4 text-black" />
                  </div>
                  <div>
                    <h3 className="font-light text-gray-100 text-base md:text-sm">{goal.nombre}</h3>
                    <p className="text-sm md:text-xs text-gray-500 font-light">{goalType?.label}</p>
                  </div>
                </div>
                <div className="flex space-x-3 md:space-x-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-2.5 md:p-1.5 text-gray-500 hover:text-gold-400 transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center rounded-lg"
                  >
                    <Edit className="w-4 h-4 md:w-3 md:h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-2.5 md:p-1.5 text-gray-500 hover:text-red-400 transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 md:w-3 md:h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 md:space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm md:text-xs mb-2 md:mb-1.5">
                    <span className="text-gray-500 font-light">Progreso</span>
                    <span className="font-light text-gray-200">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-dark-800/50 rounded-full h-3 md:h-2 backdrop-blur-sm">
                    <div
                      className={`h-3 md:h-2 rounded-full transition-all duration-500 shadow-lg ${
                        status === 'completada' ? 'bg-green-500' :
                        status === 'atrasada' ? 'bg-red-500' : 'bg-gold-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Goal Details */}
                <div className="space-y-2 md:space-y-1.5">
                  <div className="flex justify-between text-sm md:text-xs">
                    <span className="text-gray-500 font-light">Actual:</span>
                    <span className="font-light text-gray-200">
                      {goal.tipo === 'facturacion' ? formatCurrency(currentValue) : formatNumber(currentValue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base md:text-sm">
                    <span className="text-gray-400">Objetivo:</span>
                    <span className="font-medium text-gray-200">
                      {goal.tipo === 'facturacion' ? formatCurrency(goal.objetivo) : formatNumber(goal.objetivo)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base md:text-sm">
                    <span className="text-gray-400">Fecha límite:</span>
                    <span className="font-medium text-gray-200">{new Date(goal.fechaLimite).toLocaleDateString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between text-base md:text-sm">
                    <span className="text-gray-400">Asignado a:</span>
                    <span className="font-medium text-gray-200">{goal.asignadoA}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <span className={`px-4 py-2 md:px-3 md:py-1 rounded-full text-sm md:text-xs font-medium ${getStatusColor(status)}`}>
                    {getStatusText(status)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {goals.length === 0 && (
          <div className="col-span-full text-center py-16 md:py-12">
            <Target className="w-20 h-20 md:w-16 md:h-16 text-gray-600 mx-auto mb-5 md:mb-4" />
            <h3 className="text-xl md:text-lg font-medium text-gray-200 mb-3 md:mb-2">No hay metas</h3>
            <p className="text-base md:text-sm text-gray-400 mb-5 md:mb-4">Crea tu primera meta para comenzar</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="w-6 h-6 md:w-5 md:h-5 mr-2" />
              Crear Meta
            </button>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="md:hidden fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded-full shadow-2xl flex items-center justify-center z-30 animate-glow"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create/Edit Goal Modal */}
      {showModal && (
        <Modal
          title={editingGoal ? 'Editar Meta' : 'Nueva Meta'}
          onClose={resetForm}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de la Meta
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="input-field"
                placeholder="Ej: Meta mensual de ventas"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Meta
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="input-field"
                required
              >
                {goalTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Valor Objetivo
              </label>
              <input
                type="number"
                value={formData.objetivo}
                onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                className="input-field"
                min="0"
                step={formData.tipo === 'facturacion' ? '0.01' : '1'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha Límite
              </label>
              <input
                type="date"
                value={formData.fechaLimite}
                onChange={(e) => setFormData({...formData, fechaLimite: e.target.value})}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Asignado a
              </label>
              <input
                type="text"
                value={formData.asignadoA}
                onChange={(e) => setFormData({...formData, asignadoA: e.target.value})}
                className="input-field"
                placeholder="Nombre del responsable"
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
              >
                {editingGoal ? 'Actualizar Meta' : 'Crear Meta'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default GoalsSection