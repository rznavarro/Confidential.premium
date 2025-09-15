import React, { useState, useEffect } from 'react'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import { employeeDatabase } from './data/employees'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('vortexia_user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        // Verificar que el usuario aún existe en la base de datos
        const userExists = employeeDatabase.find(emp => emp.code === userData.code)
        if (userExists) {
          // Cargar foto de perfil si existe
          const savedPhoto = localStorage.getItem(`vortexia_photo_${userData.code}`)
          if (savedPhoto) {
            userData.profilePhoto = savedPhoto
          }
          setCurrentUser(userData)
        } else {
          // Usuario no existe, limpiar sesión
          localStorage.removeItem('vortexia_user')
        }
      }
    } catch (error) {
      console.error('Error al cargar sesión:', error)
      localStorage.removeItem('vortexia_user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLogin = (userData) => {
    try {
      // Guardar foto de perfil en localStorage si existe
      if (userData.profilePhoto) {
        localStorage.setItem(`vortexia_photo_${userData.code}`, userData.profilePhoto)
      }
      localStorage.setItem('vortexia_user', JSON.stringify(userData))
      setCurrentUser(userData)
    } catch (error) {
      console.error('Error al guardar sesión:', error)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('vortexia_user')
      localStorage.removeItem('vortexia_reports')
      localStorage.removeItem('vortexia_deals')
      localStorage.removeItem('vortexia_goals')
      // Limpiar foto de perfil del usuario actual
      if (currentUser) {
        localStorage.removeItem(`vortexia_photo_${currentUser.code}`)
      }
      setCurrentUser(null)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gold-400 text-lg">Cargando Vortexia...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {currentUser ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App