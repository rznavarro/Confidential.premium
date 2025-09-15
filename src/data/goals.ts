import { Goal } from '../types';

// In-memory storage for goals
let goals: Goal[] = [];

export const createGoal = (goalData: Goal): void => {
  goals.push(goalData);
  // Persist to localStorage for demo purposes
  localStorage.setItem('vortexia_goals', JSON.stringify(goals));
};

export const getGoals = (): Goal[] => {
  // Load from localStorage on first access
  if (goals.length === 0) {
    const stored = localStorage.getItem('vortexia_goals');
    if (stored) {
      goals = JSON.parse(stored).map((goal: any) => ({
        ...goal,
        deadline: new Date(goal.deadline),
        createdAt: new Date(goal.createdAt)
      }));
    }
  }
  return goals;
};

export const getGoalsByAssignee = (userId: string): Goal[] => {
  return getGoals().filter(goal => goal.assignedTo === userId);
};

export const getGoalsByAssigner = (userId: string): Goal[] => {
  return getGoals().filter(goal => goal.assignedBy === userId);
};

export const updateGoalStatus = (goalId: string, status: Goal['status']): void => {
  goals = goals.map(goal => 
    goal.id === goalId ? { ...goal, status } : goal
  );
  localStorage.setItem('vortexia_goals', JSON.stringify(goals));
};

export const deleteGoal = (goalId: string): void => {
  goals = goals.filter(goal => goal.id !== goalId);
  localStorage.setItem('vortexia_goals', JSON.stringify(goals));
};

export const getTeamGoals = (supervisorId: string): Goal[] => {
  return getGoals().filter(goal => goal.assignedBy === supervisorId);
};