export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CEO' | 'Supervisor' | 'Vendedor' | 'Vendedor Senior';
  accessCode: string;
  team?: string;
  supervisor?: string;
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  supervisor: string;
  members: string[];
  color: string;
  icon: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  selectedTeam: Team | null;
  currentStep: 'login' | 'team-selection' | 'team-verification' | 'dashboard';
}

export interface Metrics {
  linkedinContacts: number;
  messagesSent: number;
  responses: number;
  personalEarnings: number;
  meetings?: number;
  sales?: number;
  dailyRevenue?: number;
  monthlyRevenue?: number;
}

export interface Deal {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  servicePrice: number;
  creationCost?: number;
  commission?: number;
  createdBy: string;
  createdAt: Date;
  status: 'pending' | 'closed' | 'cancelled';
}

export interface DealFormData {
  clientName: string;
  email: string;
  phone: string;
  servicePrice: number;
  creationCost?: number;
  commission?: number;
}

export interface Report {
  id: string;
  linkedinContacts: number;
  messagesSent: number;
  responses: number;
  meetings?: number;
  period: string;
  createdBy: string;
  createdAt: Date;
}

export interface ReportFormData {
  linkedinContacts: number;
  messagesSent: number;
  responses: number;
  meetings?: number;
  period: string;
}

export interface Goal {
  id: string;
  assignedTo: string;
  assignedBy: string;
  salesTarget: number;
  prospectingTarget: number;
  prospectingStrategy: string;
  deadline: Date;
  notes: string;
  status: 'active' | 'completed' | 'overdue';
  createdAt: Date;
}

export interface GoalFormData {
  assignedTo: string;
  salesTarget: number;
  prospectingTarget: number;
  prospectingStrategy: string;
  deadline: string;
  notes: string;
}