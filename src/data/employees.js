export const employeeDatabase = [
  // CEO
  {
    code: 'VX001',
    name: 'Joaquín Navarro',
    email: 'joaquin.navarro@vortexia.com',
    role: 'CEO',
    team: 'CEO2024',
    level: 'ceo'
  },
  
  // Supervisores de Ventas
  {
    code: 'VX002',
    name: 'Javier Pino',
    email: 'javier.pino@vortexia.com',
    role: 'Supervisor de Ventas',
    team: 'PINO2024',
    level: 'supervisor'
  },
  {
    code: 'VX003',
    name: 'Joaquín Lizana',
    email: 'joaquin.lizana@vortexia.com',
    role: 'Supervisor de Ventas',
    team: 'LIZANA2024',
    level: 'supervisor'
  },
  
  // Equipo Javier Pino
  {
    code: 'VX004',
    name: 'Vicente Sáez',
    email: 'vicente.saez@vortexia.com',
    role: 'Vendedor Senior',
    team: 'PINO2024',
    level: 'senior',
    supervisor: 'VX002'
  },
  {
    code: 'VX005',
    name: 'Vicente Henríquez',
    email: 'vicente.henriquez@vortexia.com',
    role: 'Vendedor Senior',
    team: 'PINO2024',
    level: 'senior',
    supervisor: 'VX002'
  },
  
  // Equipo Joaquín Lizana
  {
    code: 'VX006',
    name: 'Ignacio',
    email: 'ignacio@vortexia.com',
    role: 'Vendedor',
    team: 'LIZANA2024',
    level: 'vendedor',
    supervisor: 'VX003'
  },
  {
    code: 'VX007',
    name: 'Martín Paredes',
    email: 'martin.paredes@vortexia.com',
    role: 'Vendedor',
    team: 'LIZANA2024',
    level: 'vendedor',
    supervisor: 'VX003'
  },
  
  // Vendedores Independientes
  {
    code: 'VX008',
    name: 'Lucas Arredondo',
    email: 'lucas.arredondo@vortexia.com',
    role: 'Vendedor Independiente',
    team: 'INDEPENDIENTE',
    level: 'independiente'
  },
  {
    code: 'VX009',
    name: 'Jorge Chacón Vázquez',
    email: 'jorge.chacon@vortexia.com',
    role: 'Vendedor Independiente',
    team: 'INDEPENDIENTE',
    level: 'independiente'
  },
  {
    code: 'VX010',
    name: 'Agustín Millacura',
    email: 'agustin.millacura@vortexia.com',
    role: 'Vendedor Independiente',
    team: 'INDEPENDIENTE',
    level: 'independiente'
  },
  {
    code: 'VX011',
    name: 'Sebastián Moreno',
    email: 'sebastian.moreno@vortexia.com',
    role: 'Vendedor Independiente',
    team: 'INDEPENDIENTE',
    level: 'independiente'
  },
  {
    code: 'VX012',
    name: 'Álvaro Arroyo',
    email: 'alvaro.arroyo@vortexia.com',
    role: 'Vendedor Independiente',
    team: 'INDEPENDIENTE',
    level: 'independiente'
  },
  {
    code: 'VX013',
    name: 'Santiago Soto',
    email: 'santiago.soto@vortexia.com',
    role: 'Vendedor Independiente',
    team: 'INDEPENDIENTE',
    level: 'independiente'
  },
  {
    code: 'VX014',
    name: 'Alex Bravo',
    email: 'alex.bravo@vortexia.com',
    role: 'Vendedor Independiente',
    team: 'INDEPENDIENTE',
    level: 'independiente'
  },
  {
    code: 'VX015',
    name: 'Santiago Soto',
    email: 'santiago.soto2@vortexia.com',
    role: 'Vendedor Independiente',
    team: 'INDEPENDIENTE',
    level: 'independiente'
  },
  {
    code: 'VX016',
    name: 'Roberto Mendoza',
    email: 'roberto.mendoza@vortexia.com',
    role: 'Vendedor Independiente',
    team: 'INDEPENDIENTE',
    level: 'independiente'
  }
]

export const getEmployeeByCode = (code) => {
  return employeeDatabase.find(emp => emp.code.toLowerCase() === code.toLowerCase())
}

export const getEmployeesByTeam = (team) => {
  return employeeDatabase.filter(emp => emp.team === team)
}

export const getEmployeesBySupervisor = (supervisorCode) => {
  return employeeDatabase.filter(emp => emp.supervisor === supervisorCode)
}