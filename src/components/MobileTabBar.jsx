import React from 'react'

const MobileTabBar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900/98 backdrop-blur-2xl border-t border-dark-700/50 safe-area-bottom z-40 shadow-2xl">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-1 text-xs font-medium transition-all duration-200 min-h-[70px] touch-manipulation active:scale-95 ${
                isActive 
                  ? 'text-gold-400 bg-gradient-to-t from-gold-900/30 to-transparent relative' 
                  : 'text-gray-500 hover:text-gray-300 active:bg-dark-800/50'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full shadow-lg"></div>
              )}
              <Icon className={`w-6 h-6 mb-1.5 transition-transform duration-200 ${
                isActive ? 'text-gold-400 scale-110 drop-shadow-sm' : 'text-gray-500'
              }`} />
              <span className={`text-xs font-medium tracking-wide ${
                isActive ? 'text-gold-400' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MobileTabBar