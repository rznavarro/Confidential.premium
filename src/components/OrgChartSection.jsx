import React from 'react'
import { Building2, User, Crown, Users, Star, Minus } from 'lucide-react'
import { employeeDatabase } from '../data/employees'

const OrgChartSection = ({ currentUser }) => {
  const ceo = employeeDatabase.find(emp => emp.level === 'ceo')
  const supervisors = employeeDatabase.filter(emp => emp.level === 'supervisor')
  const independientes = employeeDatabase.filter(emp => emp.level === 'independiente')

  const getTeamMembers = (supervisorCode) => {
    return employeeDatabase.filter(emp => emp.supervisor === supervisorCode)
  }

  const getLevelIcon = (level) => {
    switch (level) {
      case 'ceo': return Crown
      case 'supervisor': return Users
      case 'senior': return Star
      default: return User
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'ceo': return 'gradient-gold'
      case 'supervisor': return 'gradient-primary'
      case 'senior': return 'gradient-success'
      case 'vendedor': return 'gradient-success'
      default: return 'gradient-purple'
    }
  }

  const getLevelBorder = (level) => {
    switch (level) {
      case 'ceo': return 'ring-4 ring-gold-400/50'
      case 'supervisor': return 'ring-2 ring-gold-300/30'
      case 'senior': return 'ring-2 ring-green-400/30'
      default: return 'ring-1 ring-gray-400/20'
    }
  }

  const EmployeeCard = ({ employee, isCurrentUser = false }) => {
    const Icon = getLevelIcon(employee.level)
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md p-4 relative ${
        isCurrentUser ? 'border-gold-400 shadow-gold-400/20' : 
        employee.level === 'ceo' ? 'border-gold-300' :
        employee.level === 'supervisor' ? 'border-blue-300' :
        'border-gray-200'
      } hover:scale-105`}>
        
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            employee.level === 'ceo' ? 'bg-gold-100 text-gold-600' :
            employee.level === 'supervisor' ? 'bg-blue-100 text-blue-600' :
            employee.level === 'senior' ? 'bg-green-100 text-green-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {employee.profilePhoto ? (
              <img 
                src={employee.profilePhoto} 
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-sm">
              {employee.name}
            </h3>
            <p className="text-gray-500 text-xs">{employee.role}</p>
          </div>
          {isCurrentUser && (
            <div className="w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 md:space-y-10">
      <div className="text-center">
        <h2 className="text-2xl md:text-xl font-light text-gray-100 mb-2 tracking-wide">Estructura del Equipo</h2>
        <p className="text-gray-500 text-base md:text-sm font-light">Mapa organizacional</p>
      </div>

      {/* CEO */}
      <div className="text-center relative">
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <EmployeeCard 
              employee={ceo} 
              isCurrentUser={currentUser.code === ceo.code}
            />
          </div>
        </div>
        
        {/* Línea vertical hacia supervisores */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-8 bg-gray-300 mt-4"></div>
      </div>

      {/* Supervisores y sus equipos */}
      <div className="relative">
        {/* Línea horizontal entre supervisores */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-px bg-gray-300"></div>
        <div className="absolute top-0 left-1/4 w-px h-4 bg-gray-300"></div>
        <div className="absolute top-0 right-1/4 w-px h-4 bg-gray-300"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-8 pt-4">
          {supervisors.map((supervisor) => {
            const teamMembers = getTeamMembers(supervisor.code)
            
            return (
              <div key={supervisor.code} className="space-y-6 md:space-y-4 relative">
                {/* Supervisor */}
                <div className="flex justify-center">
                  <EmployeeCard 
                    employee={supervisor}
                    isCurrentUser={currentUser.code === supervisor.code}
                  />
                </div>
                
                {/* Línea vertical hacia equipo */}
                {teamMembers.length > 0 && (
                  <div className="flex justify-center">
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                )}
                
                {/* Miembros del equipo */}
                {teamMembers.length > 0 && (
                  <div className="relative">
                    {/* Líneas horizontales para conectar miembros del equipo */}
                    {teamMembers.length > 1 && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-px bg-gray-300"></div>
                    )}
                    {teamMembers.map((_, index) => (
                      <div 
                        key={index}
                        className="absolute top-0 w-px h-4 bg-gray-300"
                        style={{ 
                          left: teamMembers.length === 1 ? '50%' : 
                                `${25 + (index * 50)}%`,
                          transform: 'translateX(-50%)'
                        }}
                      />
                    ))}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-3 pt-4">
                      {teamMembers.map((member) => (
                        <EmployeeCard 
                          key={member.code}
                          employee={member}
                          isCurrentUser={currentUser.code === member.code}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Vendedores Independientes */}
      <div className="relative">
        <h3 className="text-base font-medium text-gray-400 mb-6 text-center">
          Independientes
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {independientes.map((vendedor) => (
            <EmployeeCard 
              key={vendedor.code}
              employee={vendedor}
              isCurrentUser={currentUser.code === vendedor.code}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

export default OrgChartSection