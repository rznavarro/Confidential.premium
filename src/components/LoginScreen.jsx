import React, { useState } from 'react'
import { Building2, User, AlertCircle, Camera, Upload } from 'lucide-react'
import { getEmployeeByCode } from '../data/employees'

const LoginScreen = ({ onLogin }) => {
  const [userCode, setUserCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000))

      const employee = getEmployeeByCode(userCode.trim())
      
      if (employee) {
        onLogin(employee)
      } else {
        setError('Código de usuario inválido. Verifica tu código e intenta nuevamente.')
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-dark-900 to-dark-800 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-gold-600/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="w-full max-w-sm relative z-10">
        {/* Logo y título */}
        <div className="text-center mb-6 animate-bounce-in">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 md:w-28 md:h-28">
              <img 
                src="/Vortexia copy copy copy.png" 
                alt="Vortexia Logo"
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Formulario de login */}
        <div className="glass-card p-6 md:p-6 animate-fade-in exclusive-glow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userCode" className="block text-sm font-light text-gray-400 mb-3 tracking-wide">
                Código de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="userCode"
                  type="text"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 text-lg"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !userCode.trim()}
              className="w-full bg-gradient-to-r from-gold-400 to-gold-600 text-black font-semibold py-4 px-6 rounded-lg hover:from-gold-500 hover:to-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg tracking-wide"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm font-extralight tracking-wide">
            © 2024 Vortexia. Sistema de Gestión de Ventas.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen