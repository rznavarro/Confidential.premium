import { Team } from '../types';

export const teams: Team[] = [
  {
    id: 'equipo-lizana',
    name: 'EQUIPO LIZANA',
    supervisor: 'Joaquín Lizana',
    members: ['ignacio@vortexia.com', 'martin.paredes@vortexia.com'],
    color: '#4338ca',
    icon: '🔵'
  },
  {
    id: 'equipo-pino',
    name: 'EQUIPO PINO',
    supervisor: 'Javier Pino',
    members: ['vicente.saez@vortexia.com', 'vicente.henriquez@vortexia.com'],
    color: '#7c3aed',
    icon: '🟣'
  },
  {
    id: 'equipo-ceo',
    name: 'EQUIPO DIRECTO CEO',
    supervisor: 'Joaquín Navarro',
    members: [
      'lucas.arredondo@vortexia.com',
      'jorge.chacon@vortexia.com',
      'agustin.millacura@vortexia.com',
      'sebastian.moreno@vortexia.com',
      'alvaro.arroyo@vortexia.com',
      'santiago.soto@vortexia.com',
      'alex.bravo@vortexia.com',
      'diego.silva@vortexia.com',
      'roberto.mendoza@vortexia.com'
    ],
    color: '#06b6d4',
    icon: '⭐'
  }
];

export const teamCodes: Record<string, string> = {
  'equipo-lizana': 'LIZANA2024',
  'equipo-pino': 'PINO2024',
  'equipo-ceo': 'CEO2024'
};

export const getTeamById = (teamId: string): Team | null => {
  return teams.find(team => team.id === teamId) || null;
};

export const getTeamByCode = (code: string): Team | null => {
  const teamId = Object.keys(teamCodes).find(key => teamCodes[key] === code);
  return teamId ? getTeamById(teamId) : null;
};