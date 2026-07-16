import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee } from '../types';

const mockEmployees: Employee[] = [
  // Super Admin
  { id: 'admin-1', name: 'Rajesh Kumar Sharma', firstName: 'Rajesh', middleName: 'Kumar', lastName: 'Sharma', dob: '1978-04-12', gender: 'male', uniqueNumber: 'BSL-001', username: 'superadmin', password: '1234', role: 'super_admin', department: 'Administration', walletBalance: 50000.00, email: 'rajesh.sharma@banswarasyntex.com', phone: '9414201001', isActive: true, canteenId: 'banswara-main' },

  // Canteen Supervisor
  { id: 'mgr-1', name: 'Suresh Lal Meena', firstName: 'Suresh', middleName: 'Lal', lastName: 'Meena', dob: '1983-07-22', gender: 'male', uniqueNumber: 'BSL-002', username: 'supervisor', password: '1234', role: 'canteen_supervisor', department: 'Canteen Operations', walletBalance: 8500.00, email: 'suresh.meena@banswarasyntex.com', phone: '9414202002', isActive: true, canteenId: 'banswara-main' },

  // Counter Managers
  { id: 'cnt-1', name: 'Priya Devi Patel', firstName: 'Priya', middleName: 'Devi', lastName: 'Patel', dob: '1991-03-14', gender: 'female', uniqueNumber: 'BSL-003', username: 'counter', password: '1234', role: 'counter_manager', department: 'Canteen Services', walletBalance: 3200.00, email: 'priya.patel@banswarasyntex.com', phone: '9414203003', isActive: true, canteenId: 'banswara-main' },
  { id: 'cnt-2', name: 'Deepak Singh Rathore', firstName: 'Deepak', middleName: 'Singh', lastName: 'Rathore', dob: '1989-11-30', gender: 'male', uniqueNumber: 'BSL-004', username: 'counter2', password: '1234', role: 'counter_manager', department: 'Canteen Services', walletBalance: 2750.00, email: 'deepak.rathore@banswarasyntex.com', phone: '9414204004', isActive: true, canteenId: 'banswara-main' },

  // Regular Employees
  { id: 'emp-1', name: 'Ramesh Chand Gupta', firstName: 'Ramesh', middleName: 'Chand', lastName: 'Gupta', dob: '1990-06-18', gender: 'male', uniqueNumber: 'BSL-101', username: 'employee', password: '1234', role: 'employee', department: 'Weaving', walletBalance: 1200.00, email: 'ramesh.gupta@banswarasyntex.com', phone: '9414205101', isActive: true, canteenId: 'banswara-main' },
  { id: 'emp-2', name: 'Anita Kumari Verma', firstName: 'Anita', middleName: 'Kumari', lastName: 'Verma', dob: '1993-02-05', gender: 'female', uniqueNumber: 'BSL-102', username: 'anita.verma', password: '1234', role: 'employee', department: 'Spinning', walletBalance: 950.50, email: 'anita.verma@banswarasyntex.com', phone: '9414205102', isActive: true, canteenId: 'banswara-main' },
  { id: 'emp-3', name: 'Mahesh Prasad Yadav', firstName: 'Mahesh', middleName: 'Prasad', lastName: 'Yadav', dob: '1987-09-25', gender: 'male', uniqueNumber: 'BSL-103', username: 'mahesh.yadav', password: '1234', role: 'employee', department: 'Dyeing', walletBalance: 1750.00, email: 'mahesh.yadav@banswarasyntex.com', phone: '9414205103', isActive: true, canteenId: 'banswara-main' },
  { id: 'emp-4', name: 'Sunita Bai Joshi', firstName: 'Sunita', middleName: 'Bai', lastName: 'Joshi', dob: '1995-12-10', gender: 'female', uniqueNumber: 'BSL-104', username: 'sunita.joshi', password: '1234', role: 'employee', department: 'Quality Control', walletBalance: 620.25, email: 'sunita.joshi@banswarasyntex.com', phone: '9414205104', isActive: true, canteenId: 'banswara-main' },
  { id: 'emp-5', name: 'Vijay Kumar Soni', firstName: 'Vijay', middleName: 'Kumar', lastName: 'Soni', dob: '1985-08-03', gender: 'male', uniqueNumber: 'BSL-105', username: 'vijay.soni', password: '1234', role: 'employee', department: 'Finishing', walletBalance: 2100.00, email: 'vijay.soni@banswarasyntex.com', phone: '9414205105', isActive: true, canteenId: 'banswara-main' },
  { id: 'emp-6', name: 'Kavita Sharma', firstName: 'Kavita', lastName: 'Sharma', dob: '1994-04-20', gender: 'female', uniqueNumber: 'BSL-106', username: 'kavita.sharma', password: '1234', role: 'employee', department: 'Accounts', walletBalance: 1380.00, email: 'kavita.sharma@banswarasyntex.com', phone: '9414205106', isActive: true, canteenId: 'banswara-main' },
  { id: 'emp-7', name: 'Mohan Lal Kumawat', firstName: 'Mohan', middleName: 'Lal', lastName: 'Kumawat', dob: '1988-01-17', gender: 'male', uniqueNumber: 'BSL-107', username: 'mohan.kumawat', password: '1234', role: 'employee', department: 'Maintenance', walletBalance: 875.00, email: 'mohan.kumawat@banswarasyntex.com', phone: '9414205107', isActive: true, canteenId: 'banswara-main' },
  { id: 'emp-8', name: 'Rekha Devi Trivedi', firstName: 'Rekha', middleName: 'Devi', lastName: 'Trivedi', dob: '1996-07-08', gender: 'female', uniqueNumber: 'BSL-108', username: 'rekha.trivedi', password: '1234', role: 'employee', department: 'HR', walletBalance: 1650.00, email: 'rekha.trivedi@banswarasyntex.com', phone: '9414205108', isActive: true, canteenId: 'banswara-main' },
  { id: 'emp-9', name: 'Ashok Nagar', firstName: 'Ashok', lastName: 'Nagar', dob: '1982-10-29', gender: 'male', uniqueNumber: 'BSL-109', username: 'ashok.nagar', password: '1234', role: 'employee', department: 'Weaving', walletBalance: 430.00, email: 'ashok.nagar@banswarasyntex.com', phone: '9414205109', isActive: true, canteenId: 'banswara-main' },
  { id: 'emp-10', name: 'Pooja Meena', firstName: 'Pooja', lastName: 'Meena', dob: '1997-05-15', gender: 'female', uniqueNumber: 'BSL-110', username: 'pooja.meena', password: '1234', role: 'employee', department: 'Packing', walletBalance: 1900.00, email: 'pooja.meena@banswarasyntex.com', phone: '9414205110', isActive: true, canteenId: 'banswara-main' },
];

interface EmployeeState {
  employees: Employee[];
  addEmployee: (e: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  rechargeWallet: (id: string, amount: number) => void;
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set) => ({
      employees: [...mockEmployees],
      addEmployee: (e) =>
        set((s) => ({ employees: [...s.employees, { ...e, id: String(Date.now()) }] })),
      updateEmployee: (id, data) =>
        set((s) => ({ employees: s.employees.map((e) => (e.id === id ? { ...e, ...data } : e)) })),
      deleteEmployee: (id) =>
        set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),
      rechargeWallet: (id, amount) =>
        set((s) => ({
          employees: s.employees.map((e) =>
            e.id === id ? { ...e, walletBalance: e.walletBalance + amount } : e
          ),
        })),
    }),
    { name: 'employee-storage' }
  )
);
