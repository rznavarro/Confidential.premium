import React, { useState } from 'react'
import { Plus, Edit, Trash2, ExternalLink, Users, User, Linkedin } from 'lucide-react'
import Modal from './Modal'

const LinkedInSection = ({ linkedinProfiles, onLinkedInUpdate }) => {
  const currentUser = JSON.parse(localStorage.getItem('vortexia_user') || '{}')

  const [showModal, setShowModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState(null)
  const [formData, setFormData] = useState({
    perfilPersonal: '',
    redContactos: '',
    descripcion: ''
  })

  // Obtener perfil del usuario actual
  const getUserProfile = () => {
    return linkedinProfiles.find(profile => profile.userCode === currentUser.code)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const profileData = {
      ...formData,
      userCode: currentUser.code,
      userName: currentUser.name,
      userRole: currentUser.role,
      fechaCreacion: editingProfile ? editingProfile.fechaCreacion : new Date().toISOString(),
      fechaCreacionFormateada: editingProfile ? editingProfile.fechaCreacionFormateada : new Date().toLocaleDateString('es-CL'),
      fechaActualizacion: new Date().toISOString(),
      fechaActualizacionFormateada: new Date().toLocaleDateString('es-CL')
    }

    if (editingProfile) {
      const updatedProfiles = linkedinProfiles.map(profile => 
        profile.id === editingProfile.id ? { ...profileData, id: editingProfile.id } : profile
      )
      onLinkedInUpdate(updatedProfiles)
    } else {
      const newProfile = {
        id: Date.now(),
        ...profileData
      }
      onLinkedInUpdate([...linkedinProfiles, newProfile])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      perfilPersonal: '',
      redContactos: '',
      descripcion: ''
    })
    setShowModal(false)
    setEditingProfile(null)
  }

  const handleEdit = (profile) => {
    setEditingProfile(profile)
    setFormData({
      perfilPersonal: profile.perfilPersonal,
      redContactos: profile.redContactos,
      descripcion: profile.descripcion || ''
    })
    setShowModal(true)
  }

  const handleDelete = (profileId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu perfil de LinkedIn?')) {
      onLinkedInUpdate(linkedinProfiles.filter(profile => profile.id !== profileId))
    }
  }

  const openLinkedInUrl = (url) => {
    if (url) {
      // Asegurar que la URL tenga protocolo
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`
      window.open(formattedUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const validateLinkedInUrl = (url) => {
    if (!url) return false
    const linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i
    return linkedinPattern.test(url)
  }

  const userProfile = getUserProfile()

  return (
    <div className="space-y-6 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-xl font-light text-gray-100 tracking-wide">LinkedIn</h2>
          <p className="text-gray-500 text-base md:text-sm font-extralight">
            Gestiona tus enlaces de LinkedIn para prospección
          </p>
        </div>
        {!userProfile && (
          <button
            onClick={() => setShowModal(true)}
            className="hidden md:flex btn-primary"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span className="text-sm">Configurar LinkedIn</span>
          </button>
        )}
      </div>

      {/* User Profile */}
      {userProfile ? (
        <div className="card animate-fade-in p-5 md:p-4">
          <div className="flex items-center justify-between mb-4 md:mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Linkedin className="w-5 h-5 md:w-4 md:h-4 text-white" />
              </div>
              <div>
                <h3 className="font-light text-gray-100 text-base md:text-sm">{userProfile.userName}</h3>
                <p className="text-sm md:text-xs text-gray-500 font-light">{userProfile.userRole}</p>
              </div>
            </div>
            <div className="flex space-x-2 md:space-x-1">
              <button
                onClick={() => handleEdit(userProfile)}
                className="p-2.5 md:p-1.5 text-gray-500 hover:text-gold-400 transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center rounded-lg"
              >
                <Edit className="w-4 h-4 md:w-3 md:h-3" />
              </button>
              <button
                onClick={() => handleDelete(userProfile.id)}
                className="p-2.5 md:p-1.5 text-gray-500 hover:text-red-400 transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center rounded-lg"
              >
                <Trash2 className="w-4 h-4 md:w-3 md:h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-4 md:space-y-3">
            {/* Perfil Personal */}
            <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
              <div className="flex items-center justify-between mb-2 md:mb-1.5">
                <h4 className="text-base md:text-sm font-medium text-blue-400 flex items-center">
                  <User className="w-4 h-4 md:w-3 md:h-3 mr-1.5" />
                  Perfil Personal
                </h4>
                <button
                  onClick={() => openLinkedInUrl(userProfile.perfilPersonal)}
                  disabled={!validateLinkedInUrl(userProfile.perfilPersonal)}
                  className="flex items-center space-x-1 px-3 py-1.5 md:px-2 md:py-1 text-sm md:text-xs bg-blue-900/20 text-blue-400 rounded-md hover:bg-blue-900/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] md:min-h-auto"
                >
                  <ExternalLink className="w-4 h-4 md:w-3 md:h-3" />
                  <span>Abrir</span>
                </button>
              </div>
              <p className="text-sm md:text-xs text-gray-300 font-light break-all">
                {userProfile.perfilPersonal || 'No configurado'}
              </p>
            </div>

            {/* Red de Contactos */}
            <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
              <div className="flex items-center justify-between mb-2 md:mb-1.5">
                <h4 className="text-base md:text-sm font-medium text-green-400 flex items-center">
                  <Users className="w-4 h-4 md:w-3 md:h-3 mr-1.5" />
                  Red de Contactos
                </h4>
                <button
                  onClick={() => openLinkedInUrl(userProfile.redContactos)}
                  disabled={!validateLinkedInUrl(userProfile.redContactos)}
                  className="flex items-center space-x-1 px-3 py-1.5 md:px-2 md:py-1 text-sm md:text-xs bg-green-900/20 text-green-400 rounded-md hover:bg-green-900/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] md:min-h-auto"
                >
                  <ExternalLink className="w-4 h-4 md:w-3 md:h-3" />
                  <span>Abrir</span>
                </button>
              </div>
              <p className="text-sm md:text-xs text-gray-300 font-light break-all">
                {userProfile.redContactos || 'No configurado'}
              </p>
            </div>

            {/* Descripción */}
            {userProfile.descripcion && (
              <div className="bg-dark-800/30 rounded-lg p-4 md:p-3 border border-dark-700/30">
                <h4 className="text-base md:text-sm font-medium text-gray-400 mb-2 md:mb-1.5">
                  Descripción
                </h4>
                <p className="text-sm md:text-xs text-gray-300 font-light leading-relaxed">
                  {userProfile.descripcion}
                </p>
              </div>
            )}

            {/* Fechas */}
            <div className="flex justify-between text-sm md:text-xs text-gray-500 pt-3 md:pt-2 border-t border-dark-700/30">
              <span>Creado: {userProfile.fechaCreacionFormateada}</span>
              <span>Actualizado: {userProfile.fechaActualizacionFormateada}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 md:py-12">
          <Linkedin className="w-20 h-20 md:w-16 md:h-16 text-gray-600 mx-auto mb-5 md:mb-4 opacity-50" />
          <h3 className="text-xl md:text-lg font-light text-gray-200 mb-3 md:mb-2">
            Configura tu LinkedIn
          </h3>
          <p className="text-gray-500 mb-4 md:mb-3 text-base md:text-sm font-extralight">
            Agrega tus enlaces de LinkedIn para acceso rápido durante la prospección
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 md:w-4 md:h-4 mr-2 md:mr-1.5" />
            Configurar LinkedIn
          </button>
        </div>
      )}

      {/* Mobile FAB */}
      {!userProfile && (
        <button
          onClick={() => setShowModal(true)}
          className="md:hidden fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30 animate-glow"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Create/Edit LinkedIn Modal */}
      {showModal && (
        <Modal
          title={editingProfile ? 'Editar LinkedIn' : 'Configurar LinkedIn'}
          onClose={resetForm}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                URL de Perfil Personal *
              </label>
              <input
                type="url"
                value={formData.perfilPersonal}
                onChange={(e) => setFormData({...formData, perfilPersonal: e.target.value})}
                className="input-field"
                placeholder="https://www.linkedin.com/in/tu-perfil"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tu perfil personal de LinkedIn para prospección directa
              </p>
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                URL de Red de Contactos *
              </label>
              <input
                type="url"
                value={formData.redContactos}
                onChange={(e) => setFormData({...formData, redContactos: e.target.value})}
                className="input-field"
                placeholder="https://www.linkedin.com/mynetwork/"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Sección de contactos para gestionar tu red
              </p>
            </div>

            <div>
              <label className="block text-base md:text-sm font-medium text-gray-300 mb-3 md:mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                className="input-field min-h-[80px] resize-none"
                placeholder="Notas sobre tu estrategia de LinkedIn, objetivos, etc."
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
                {editingProfile ? 'Actualizar LinkedIn' : 'Guardar LinkedIn'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default LinkedInSection