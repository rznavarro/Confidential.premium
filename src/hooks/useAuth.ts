import { useState, useCallback } from 'react';
import { AuthState, User, Team } from '../types';
import { findUserByCredentials } from '../data/users';
import { getTeamById, teamCodes } from '../data/teams';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    selectedTeam: null,
    currentStep: 'login'
  });

  const login = useCallback((email: string, accessCode: string): boolean => {
    const user = findUserByCredentials(email, accessCode);
    if (user) {
      setAuthState(prev => ({
        ...prev,
        user,
        currentStep: user.role === 'CEO' ? 'dashboard' : 'team-selection'
      }));
      return true;
    }
    return false;
  }, []);

  const selectTeam = useCallback((teamId: string) => {
    const team = getTeamById(teamId);
    if (team) {
      setAuthState(prev => ({
        ...prev,
        selectedTeam: team,
        currentStep: prev.user?.role === 'Supervisor' ? 'dashboard' : 'team-verification'
      }));
    }
  }, []);

  const verifyTeam = useCallback((teamCode: string): boolean => {
    if (authState.selectedTeam && teamCodes[authState.selectedTeam.id] === teamCode) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        currentStep: 'dashboard'
      }));
      return true;
    }
    return false;
  }, [authState.selectedTeam]);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      selectedTeam: null,
      currentStep: 'login'
    });
  }, []);

  const goBackToTeamSelection = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      selectedTeam: null,
      currentStep: 'team-selection'
    }));
  }, []);

  return {
    authState,
    login,
    selectTeam,
    verifyTeam,
    logout,
    goBackToTeamSelection
  };
};