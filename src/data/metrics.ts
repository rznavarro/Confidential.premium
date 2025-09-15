import { Metrics, Deal, Report } from '../types';

// In-memory storage for deals and reports
let deals: Deal[] = [];
let reports: Report[] = [];

export const generateUserMetrics = (userId: string, userRole: string): Metrics => {
  // Get user's deals and reports
  const userDeals = deals.filter(deal => deal.createdBy === userId && deal.status === 'closed');
  const userReports = reports.filter(report => report.createdBy === userId);

  // Calculate earnings from deals
  const personalEarnings = userDeals.reduce((sum, deal) => {
    if (userRole === 'CEO') {
      return sum + (deal.servicePrice - (deal.creationCost || 0));
    } else {
      return sum + (deal.commission || 0);
    }
  }, 0);

  // Calculate metrics from reports
  const linkedinContacts = userReports.reduce((sum, report) => sum + report.linkedinContacts, 0);
  const messagesSent = userReports.reduce((sum, report) => sum + report.messagesSent, 0);
  const responses = userReports.reduce((sum, report) => sum + report.responses, 0);
  const meetings = userReports.reduce((sum, report) => sum + (report.meetings || 0), 0);

  const baseMetrics: Metrics = {
    linkedinContacts,
    messagesSent,
    responses,
    personalEarnings
  };

  // Add role-specific metrics
  if (userRole === 'CEO') {
    baseMetrics.meetings = meetings;
    baseMetrics.sales = userDeals.length;
    baseMetrics.dailyRevenue = personalEarnings / 30; // Approximate daily
    baseMetrics.monthlyRevenue = personalEarnings;
  }

  return baseMetrics;
};

export const generateTeamMetrics = (teamId: string): number => {
  const teamDeals = deals.filter(deal => {
    // Get user by deal creator and check if they belong to the team
    const users = JSON.parse(localStorage.getItem('vortexia_users') || '[]');
    const user = users.find((u: any) => u.id === deal.createdBy);
    return user && user.team === teamId && deal.status === 'closed';
  });
  
  return teamDeals.reduce((sum, deal) => sum + deal.servicePrice, 0);
};

export const createDeal = (dealData: Deal): void => {
  deals.push(dealData);
  // Persist to localStorage for demo purposes
  localStorage.setItem('vortexia_deals', JSON.stringify(deals));
};

export const createReport = (reportData: Report): void => {
  reports.push(reportData);
  // Persist to localStorage for demo purposes
  localStorage.setItem('vortexia_reports', JSON.stringify(reports));
};

export const getDeals = (): Deal[] => {
  // Load from localStorage on first access
  if (deals.length === 0) {
    const stored = localStorage.getItem('vortexia_deals');
    if (stored) {
      deals = JSON.parse(stored);
    }
  }
  return deals;
};

export const getReports = (): Report[] => {
  // Load from localStorage on first access
  if (reports.length === 0) {
    const stored = localStorage.getItem('vortexia_reports');
    if (stored) {
      reports = JSON.parse(stored);
    }
  }
  return reports;
};

export const getDealsByUser = (userId: string): Deal[] => {
  return getDeals().filter(deal => deal.createdBy === userId);
};

export const getReportsByUser = (userId: string): Report[] => {
  return getReports().filter(report => report.createdBy === userId);
};

export const deleteDeal = (dealId: string): void => {
  deals = deals.filter(deal => deal.id !== dealId);
  localStorage.setItem('vortexia_deals', JSON.stringify(deals));
};

export const deleteReport = (reportId: string): void => {
  reports = reports.filter(report => report.id !== reportId);
  localStorage.setItem('vortexia_reports', JSON.stringify(reports));
};

export const getCompanyMetrics = (): Metrics => {
  const allDeals = getDeals().filter(deal => deal.status === 'closed');
  const allReports = getReports();
  
  const totalRevenue = allDeals.reduce((sum, deal) => sum + deal.servicePrice, 0);
  const linkedinContacts = allReports.reduce((sum, report) => sum + report.linkedinContacts, 0);
  const messagesSent = allReports.reduce((sum, report) => sum + report.messagesSent, 0);
  const responses = allReports.reduce((sum, report) => sum + report.responses, 0);
  const meetings = allReports.reduce((sum, report) => sum + (report.meetings || 0), 0);
  
  return {
    linkedinContacts,
    messagesSent,
    responses,
    personalEarnings: totalRevenue,
    sales: allDeals.length,
    meetings,
    dailyRevenue: totalRevenue / 30,
    monthlyRevenue: totalRevenue
  };
};