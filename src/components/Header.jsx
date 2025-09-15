import React from 'react'
import { Building2, LogOut, User } from 'lucide-react'

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-dark-900/80 backdrop-blur-xl shadow-sm border-b border-dark-800/30 safe-area-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-14">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-8 md:h-8 flex-shrink-0">
              <img 
                src="/Vortexia copy copy copy.png" 
                alt="Vortexia Logo"
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-sm md:text-xs font-light text-white tracking-widest uppercase opacity-80">
                VORTEXIA
              </h1>
              <span className="text-white text-sm md:text-xs font-light tracking-widest uppercase opacity-80">
                CONFIDENTIAL
              </span>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-3 md:space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-base md:text-sm font-light text-gray-200">{user.name}</p>
              <p className="text-sm md:text-xs text-gray-500 font-extralight">{user.role}</p>
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-2">
              <div className="w-9 h-9 md:w-7 md:h-7 bg-dark-800/50 rounded-full flex items-center justify-center shadow-lg overflow-hidden border border-dark-700/30">
                {user.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 md:w-3.5 md:h-3.5 text-gray-600" />
                  </div>
                )}
              </div>
              
              <button
                onClick={onLogout}
                className="p-2.5 md:p-1.5 text-gray-500 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-900/20 backdrop-blur-sm min-h-[44px] md:min-h-auto flex items-center justify-center"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header