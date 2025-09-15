import React from 'react'
import { 
  Users, 
  MessageSquare, 
  Reply, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart 
} from 'lucide-react'

const MetricsSection = ({ metrics }) => {
  const currentUser = JSON.parse(localStorage.getItem('vortexia_user') || '{}')
  const isCEO = currentUser.level === 'ceo'

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

  const metricsData = [
    {
      id: 'contactos',
      title: 'Contactos',
      value: formatNumber(metrics.contactos),
      icon: Users,
      gradient: 'gradient-primary'
    },
    {
      id: 'mensajesIniciales',
      title: 'Mensajes Iniciales',
      value: formatNumber(metrics.mensajesIniciales),
      icon: MessageSquare,
      gradient: 'gradient-success'
    },
    {
      id: 'respuestas',
      title: 'Respuestas',
      value: formatNumber(metrics.respuestas),
      icon: Reply,
      gradient: 'gradient-cyan'
    },
    ...(isCEO ? [{
      id: 'reuniones',
      title: 'Reuniones Agendadas',
      value: formatNumber(metrics.reuniones),
      icon: Calendar,
      gradient: 'gradient-warning'
    }] : []),
    {
      id: 'facturacion',
      title: 'Facturación',
      value: formatCurrency(metrics.facturacion),
      icon: DollarSign,
      gradient: 'gradient-success'
    },
    {
      id: 'ganancia',
      title: 'Ganancia',
      value: formatCurrency(metrics.ganancia),
      icon: TrendingUp,
      gradient: 'gradient-primary'
    },
    {
      id: 'gastos',
      title: 'Gastos',
      value: formatCurrency(metrics.gastos),
      icon: TrendingDown,
      gradient: 'gradient-danger'
    },
    {
      id: 'ventas',
      title: 'Cantidad de Ventas',
      value: formatNumber(metrics.ventas),
      icon: ShoppingCart,
      gradient: 'gradient-purple'
    }
  ]

  return (
    <div className="space-y-6 md:space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-xl font-light text-gray-100 mb-2 tracking-wide">Dashboard de Métricas</h2>
        <p className="text-gray-500 text-base md:text-sm font-extralight">Resumen de tu rendimiento de ventas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
        {metricsData.map((metric) => {
          const Icon = metric.icon
          
          return (
            <div
              key={metric.id}
              className={`metric-card ${metric.gradient} animate-bounce-in hover:animate-glow p-5 md:p-4`}
              style={{ animationDelay: `${metricsData.indexOf(metric) * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4 md:mb-3">
                <Icon className="w-7 h-7 md:w-6 md:h-6 text-white/70" />
                <div className="w-10 h-10 md:w-8 md:h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-5 h-5 md:w-4 md:h-4 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-white/70 text-sm md:text-xs font-light mb-2 md:mb-1 tracking-wide">
                  {metric.title}
                </h3>
                <p className="text-xl md:text-lg font-light text-white tracking-wide">
                  {metric.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resumen adicional */}
      <div className="glass-card p-5 md:p-4 exclusive-glow">
        <h3 className="text-lg md:text-base font-light text-gray-100 mb-4 md:mb-3 tracking-wide">Resumen General</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3">
          <div className="text-center p-4 md:p-3 bg-dark-800/30 rounded-lg border border-dark-700/30 backdrop-blur-sm">
            <p className="text-sm md:text-xs text-gray-500 font-light">Tasa de Respuesta</p>
            <p className="text-xl md:text-lg font-light text-gold-400">
              {metrics.mensajesIniciales > 0 
                ? `${Math.round((metrics.respuestas / metrics.mensajesIniciales) * 100)}%`
                : '0%'
              }
            </p>
          </div>
          {isCEO ? (
            <>
              <div className="text-center p-4 md:p-3 bg-dark-800/30 rounded-lg border border-dark-700/30 backdrop-blur-sm">
                <p className="text-sm md:text-xs text-gray-500 font-light">Conversión a Reunión</p>
                <p className="text-xl md:text-lg font-light text-green-400">
                  {metrics.respuestas > 0 
                    ? `${Math.round((metrics.reuniones / metrics.respuestas) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
              <div className="text-center p-4 md:p-3 bg-dark-800/30 rounded-lg border border-dark-700/30 backdrop-blur-sm">
                <p className="text-sm md:text-xs text-gray-500 font-light">Ganancia Neta</p>
                <p className="text-xl md:text-lg font-light text-gold-500">
                  {formatCurrency(metrics.ganancia - metrics.gastos)}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center p-4 md:p-3 bg-dark-800/30 rounded-lg border border-dark-700/30 backdrop-blur-sm">
              <p className="text-sm md:text-xs text-gray-500 font-light">Ratio Mensaje-Respuesta</p>
              <p className="text-xl md:text-lg font-light text-blue-400">
                {metrics.mensajesIniciales > 0 
                  ? `${Math.round((metrics.respuestas / metrics.mensajesIniciales) * 100)}%`
                  : '0%'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MetricsSection