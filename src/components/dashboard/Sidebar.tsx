import React, { ComponentType, SVGProps } from 'react';
import { Users, BarChart3, Building, Target, DollarSign, FileText } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  userRole 
}) => {
  interface Section {
    id: string;
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
  }

  const sections: Section[] = [
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'metrics', label: 'Métricas', icon: BarChart3 },
    { id: 'deals', label: 'Deals', icon: DollarSign },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'organization', label: 'Organigrama', icon: Building },
  ];

  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 p-6">
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon: React.ComponentType<SVGProps<SVGSVGElement>> = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-slate-800/30 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Estado del Sistema</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">Sistema Online</span>
        </div>
      </div>
    </aside>
  );
};