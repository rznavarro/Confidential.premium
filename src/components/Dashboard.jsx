import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  FileText, 
  DollarSign, 
  Target, 
  Users, 
  LogOut,
  Building2,
  MessageCircle
} from 'lucide-react'
import Header from './Header'
import MetricsSection from './MetricsSection'
import ReportsSection from './ReportsSection'
import DealsSection from './DealsSection'
import GoalsSection from './GoalsSection'
import OrgChartSection from './OrgChartSection'
import ContactStrategySection from './ContactStrategySection'
import LinkedInSection from './LinkedInSection'
import MobileTabBar from './MobileTabBar'

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('metricas')
  const [metrics, setMetrics] = useState({
    contactos: 0,
    mensajesIniciales: 0,
    respuestas: 0,
    reuniones: 0,
    facturacion: 0,
    ganancia: 0,
    gastos: 0,
    ventas: 0
  })
  const [reports, setReports] = useState([])
  const [deals, setDeals] = useState([])
  const [salesGoals, setSalesGoals] = useState([])
  const [contactStrategies, setContactStrategies] = useState([])
  const [linkedinProfiles, setLinkedInProfiles] = useState([])

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    try {
      const savedReports = localStorage.getItem('vortexia_reports')
      const savedDeals = localStorage.getItem('vortexia_deals')
      const savedGoals = localStorage.getItem('vortexia_goals')
      const savedStrategies = localStorage.getItem('vortexia_strategies')
      const savedLinkedIn = localStorage.getItem('vortexia_linkedin')

      if (savedReports) {
        setReports(JSON.parse(savedReports))
      }
      if (savedDeals) {
        setDeals(JSON.parse(savedDeals))
      }
      if (savedGoals) {
        setSalesGoals(JSON.parse(savedGoals))
      }
      if (savedStrategies) {
        setContactStrategies(JSON.parse(savedStrategies))
      }
      if (savedLinkedIn) {
        setLinkedInProfiles(JSON.parse(savedLinkedIn))
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }, [])

  // Actualizar métricas cuando cambien reports o deals
  useEffect(() => {
    const isCEO = user.level === 'ceo'
    const newMetrics = { ...metrics }

    // Calcular métricas desde reports
    reports.forEach(report => {
      newMetrics.contactos += report.contactos || 0
      newMetrics.mensajesIniciales += report.mensajesIniciales || 0
      newMetrics.respuestas += report.respuestas || 0
      if (isCEO) {
        newMetrics.reuniones += report.reuniones || 0
      }
    })

    // Calcular métricas desde deals
    deals.forEach(deal => {
      newMetrics.facturacion += deal.facturacion || 0
      newMetrics.gastos += deal.gastos || 0
      
      if (isCEO) {
        newMetrics.ganancia += deal.ganancia || 0
        newMetrics.ventas += deal.ventas || 0
      } else {
        // Para empleados, la ganancia es su comisión calculada
        newMetrics.ganancia += deal.gananciaNeta || 0
        newMetrics.ventas += 1 // Contar cada deal como una venta
      }
    })

    setMetrics(newMetrics)
  }, [reports, deals])

  const handleReportsUpdate = (newReports) => {
    setReports(newReports)
    try {
      localStorage.setItem('vortexia_reports', JSON.stringify(newReports))
    } catch (error) {
      console.error('Error al guardar reports:', error)
    }
  }

  const handleDealsUpdate = (newDeals) => {
    setDeals(newDeals)
    try {
      localStorage.setItem('vortexia_deals', JSON.stringify(newDeals))
    } catch (error) {
      console.error('Error al guardar deals:', error)
    }
  }

  const handleGoalsUpdate = (newGoals) => {
    setSalesGoals(newGoals)
    try {
      localStorage.setItem('vortexia_goals', JSON.stringify(newGoals))
    } catch (error) {
      console.error('Error al guardar goals:', error)
    }
  }

  const handleStrategiesUpdate = (newStrategies) => {
    setContactStrategies(newStrategies)
    try {
      localStorage.setItem('vortexia_strategies', JSON.stringify(newStrategies))
    } catch (error) {
      console.error('Error al guardar strategies:', error)
    }
  }

  const handleLinkedInUpdate = (newLinkedIn) => {
    setLinkedInProfiles(newLinkedIn)
    try {
      localStorage.setItem('vortexia_linkedin', JSON.stringify(newLinkedIn))
    } catch (error) {
      console.error('Error al guardar linkedin:', error)
    }
  }

  const tabs = [
    { id: 'metricas', label: 'Métricas', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'deals', label: 'Deals', icon: DollarSign },
    { id: 'metas', label: 'Metas', icon: Target },
    { id: 'organigrama', label: 'Equipo', icon: Users },
    { id: 'estrategia', label: 'Estrategia', icon: MessageCircle },
    { id: 'linkedin', label: 'LinkedIn', icon: Building2 }
  ]

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'metricas':
        return <MetricsSection metrics={metrics} />
      case 'reports':
        return (
          <ReportsSection 
            reports={reports} 
            onReportsUpdate={handleReportsUpdate}
          />
        )
      case 'deals':
        return (
          <DealsSection 
            deals={deals} 
            onDealsUpdate={handleDealsUpdate}
          />
        )
      case 'metas':
        return (
          <GoalsSection 
            goals={salesGoals}
            onGoalsUpdate={handleGoalsUpdate}
            metrics={metrics}
          />
        )
      case 'organigrama':
        return <OrgChartSection currentUser={user} />
      case 'estrategia':
        return (
          <ContactStrategySection 
            strategies={contactStrategies}
            onStrategiesUpdate={handleStrategiesUpdate}
          />
        )
      case 'linkedin':
        return (
          <LinkedInSection 
            linkedinProfiles={linkedinProfiles}
            onLinkedInUpdate={handleLinkedInUpdate}
          />
        )
      default:
        return <MetricsSection metrics={metrics} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <Header user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          {/* Desktop Tab Navigation */}
          <div className="hidden md:block mb-6">
            <nav className="flex space-x-1 bg-dark-900/80 rounded-2xl p-2 shadow-2xl border border-dark-700/50 backdrop-blur-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-5 py-3.5 rounded-xl font-medium transition-all duration-200 text-sm hover:scale-105 active:scale-95 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-xl shadow-gold-500/25 font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-dark-800/60 hover:shadow-lg'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'drop-shadow-sm' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="animate-fade-in space-y-4 md:space-y-6">
            {renderActiveSection()}
          </div>
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <MobileTabBar 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  )
}

export default Dashboard