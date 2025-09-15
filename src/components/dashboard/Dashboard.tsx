import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { OrganizationChart } from './OrganizationChart';
import { MetricsView } from './MetricsView';
import { TeamView } from './TeamView';
import { DealsView } from './DealsView';
import { ReportsView } from './ReportsView';
import { GoalsView } from './GoalsView';
import { Target } from 'lucide-react';
import { User } from '../../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('team');

  const renderContent = () => {
    switch (activeSection) {
      case 'team':
        return <TeamView user={user} />;
      case 'metrics':
        return <MetricsView user={user} />;
      case 'organization':
        return <OrganizationChart currentUser={user} />;
      case 'deals':
        return <DealsView user={user} />;
      case 'reports':
        return <ReportsView user={user} />;
      case 'goals':
        return <GoalsView user={user} />;
      default:
        return <TeamView user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header user={user} onLogout={onLogout} />
      
      <div className="flex flex-1">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userRole={user.role}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};