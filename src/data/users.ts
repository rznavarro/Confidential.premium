import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Joaquín Navarro',
    email: 'joaquin.navarro@vortexia.com',
    role: 'CEO',
    accessCode: 'VX001',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Javier Pino',
    email: 'javier.pino@vortexia.com',
    role: 'Supervisor',
    accessCode: 'VX002',
    team: 'equipo-pino',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Joaquín Lizana',
    email: 'joaquin.lizana@vortexia.com',
    role: 'Supervisor',
    accessCode: 'VX003',
    team: 'equipo-lizana',
    avatar: 'https://images.pexels.com/photos/2741701/pexels-photo-2741701.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    name: 'Vicente Sáez',
    email: 'vicente.saez@vortexia.com',
    role: 'Vendedor Senior',
    accessCode: 'VX004',
    supervisor: 'Javier Pino',
    team: 'equipo-pino',
    avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '5',
    name: 'Vicente Henríquez',
    email: 'vicente.henriquez@vortexia.com',
    role: 'Vendedor Senior',
    accessCode: 'VX005',
    supervisor: 'Javier Pino',
    team: 'equipo-pino',
    avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '6',
    name: 'Ignacio',
    email: 'ignacio@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX006',
    supervisor: 'Joaquín Lizana',
    team: 'equipo-lizana',
    avatar: 'https://images.pexels.com/photos/3760043/pexels-photo-3760043.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '7',
    name: 'Martín Paredes',
    email: 'martin.paredes@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX007',
    supervisor: 'Joaquín Lizana',
    team: 'equipo-lizana',
    avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '8',
    name: 'Lucas Arredondo',
    email: 'lucas.arredondo@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX008',
    supervisor: 'Joaquín Navarro',
    team: 'equipo-ceo',
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '9',
    name: 'Jorge Chacón Vázquez',
    email: 'jorge.chacon@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX009',
    supervisor: 'Joaquín Navarro',
    team: 'equipo-ceo',
    avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '10',
    name: 'Agustín Millacura',
    email: 'agustin.millacura@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX010',
    supervisor: 'Joaquín Navarro',
    team: 'equipo-ceo',
    avatar: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '11',
    name: 'Sebastián Moreno',
    email: 'sebastian.moreno@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX011',
    supervisor: 'Joaquín Navarro',
    team: 'equipo-ceo',
    avatar: 'https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '12',
    name: 'Álvaro Arroyo',
    email: 'alvaro.arroyo@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX012',
    supervisor: 'Joaquín Navarro',
    team: 'equipo-ceo',
    avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '13',
    name: 'Santiago Soto',
    email: 'santiago.soto@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX013',
    supervisor: 'Joaquín Navarro',
    team: 'equipo-ceo',
    avatar: 'https://images.pexels.com/photos/3760043/pexels-photo-3760043.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '14',
    name: 'Alex Bravo',
    email: 'alex.bravo@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX014',
    supervisor: 'Joaquín Navarro',
    team: 'equipo-ceo',
    avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '15',
    name: 'Diego Silva',
    email: 'diego.silva@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX015',
    supervisor: 'Joaquín Navarro',
    team: 'equipo-ceo',
    avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '16',
    name: 'Roberto Mendoza',
    email: 'roberto.mendoza@vortexia.com',
    role: 'Vendedor',
    accessCode: 'VX016',
    supervisor: 'Joaquín Navarro',
    team: 'equipo-ceo',
    avatar: 'https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const findUserByCredentials = (email: string, accessCode: string): User | null => {
  return users.find(user => 
    user.email.toLowerCase() === email.toLowerCase() && 
    user.accessCode.toUpperCase() === accessCode.toUpperCase()
  ) || null;
};

export const getUsersByTeam = (teamId: string): User[] => {
  return users.filter(user => user.team === teamId);
};

export const getSupervisors = (): User[] => {
  return users.filter(user => user.role === 'Supervisor');
};

export const getCEO = (): User => {
  return users.find(user => user.role === 'CEO')!;
};