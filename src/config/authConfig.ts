import type { Employee } from '../types';

export const HARDCODED_USERS: Record<string, Omit<Employee, 'id' | 'password'>> = {
  superadmin: {
    username: 'superadmin',
    name: 'Main Admin',
    firstName: 'Main',
    lastName: 'Admin',
    role: 'super_admin',
    department: 'HQ',
    walletBalance: 0,
    isActive: true,
    uniqueNumber: 'SA-001',
    dob: '1980-01-01',
    gender: 'male',
    email: 'admin@canteen.com',
    phone: '000-000-0000'
  },
  supervisor: {
    username: 'supervisor',
    name: 'Canteen Supervisor',
    firstName: 'Canteen',
    lastName: 'Supervisor',
    role: 'canteen_supervisor',
    department: 'Management',
    walletBalance: 0,
    isActive: true,
    uniqueNumber: 'CS-001',
    dob: '1985-05-15',
    gender: 'female',
    canteenId: 'banswara-main',
    email: 'supervisor@canteen.com',
    phone: '111-111-1111'
  },
  counter: {
    username: 'counter',
    name: 'Counter Manager',
    firstName: 'Counter',
    lastName: 'Manager',
    role: 'counter_manager',
    department: 'Sales',
    walletBalance: 0,
    isActive: true,
    uniqueNumber: 'CM-001',
    dob: '1990-10-10',
    gender: 'male',
    canteenId: 'banswara-main',
    email: 'counter@canteen.com',
    phone: '222-222-2222'
  },
  employee: {
    username: 'employee',
    name: 'Test Employee',
    firstName: 'Test',
    lastName: 'Employee',
    role: 'employee',
    department: 'IT',
    walletBalance: 500.00,
    isActive: true,
    uniqueNumber: 'E-001',
    dob: '1995-12-12',
    gender: 'female',
    canteenId: 'banswara-main',
    email: 'employee@canteen.com',
    phone: '333-333-3333'
  }
};

export const AUTH_PASSWORD = '1234';
