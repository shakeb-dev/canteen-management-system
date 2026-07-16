import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '../types';
import { useEmployeeStore } from './useEmployeeStore';

const mockOrders: Order[] = [
  // Today's Orders (2026-04-28)
  {
    id: 'ORD-5001', employeeId: 'emp-1', employeeName: 'Frank Castle', counterId: 'cnt-1', counterName: 'Main Food Counter', canteenId: 'banswara-main', canteenName: 'Banswara Syntex Canteen',
    items: [{ foodItemId: '1', name: 'Masala Omelette', quantity: 2, price: 50 }],
    totalAmount: 100, paymentMethod: 'wallet', status: 'completed', createdAt: '2026-04-28T08:30:00Z',
  },
  {
    id: 'ORD-5002', employeeId: 'emp-5', employeeName: 'Diana Prince', counterId: 'cnt-1', counterName: 'Main Food Counter', canteenId: 'banswara-main', canteenName: 'Banswara Syntex Canteen',
    items: [{ foodItemId: '6', name: 'Paneer Butter Masala', quantity: 3, price: 130 }],
    totalAmount: 390, paymentMethod: 'wallet', status: 'completed', createdAt: '2026-04-28T12:15:00Z',
  },
  {
    id: 'ORD-5003', employeeId: 'emp-3', employeeName: 'Sarah Connor', counterId: 'cnt-2', counterName: 'Beverage & Snacks Point', canteenId: 'banswara-main', canteenName: 'Banswara Syntex Canteen',
    items: [{ foodItemId: '10', name: 'Grilled Sandwich', quantity: 4, price: 60 }],
    totalAmount: 240, paymentMethod: 'cash', status: 'completed', createdAt: '2026-04-28T16:45:00Z',
  },
  {
    id: 'ORD-5004', employeeId: 'emp-7', employeeName: 'Barry Allen', counterId: 'cnt-1', counterName: 'Main Food Counter', canteenId: 'banswara-main', canteenName: 'Banswara Syntex Canteen',
    items: [{ foodItemId: '5', name: 'Rajma Chawal', quantity: 1, price: 90 }],
    totalAmount: 90, paymentMethod: 'wallet', status: 'pending', createdAt: '2026-04-28T14:20:00Z',
  },
  {
    id: 'ORD-5005', employeeId: 'emp-2', employeeName: 'John Wick', counterId: 'cnt-2', counterName: 'Beverage & Snacks Point', canteenId: 'banswara-main', canteenName: 'Banswara Syntex Canteen',
    items: [{ foodItemId: '13', name: 'Cold Coffee Luxe', quantity: 2, price: 55 }],
    totalAmount: 110, paymentMethod: 'cash', status: 'preparing', createdAt: '2026-04-28T15:05:00Z',
  },
  {
    id: 'ORD-5006', employeeId: 'emp-10', employeeName: 'Tony Stark', counterId: 'cnt-3', counterName: 'Executive Dining Counter', canteenId: 'banswara-main', canteenName: 'Banswara Syntex Canteen',
    items: [{ foodItemId: '7', name: 'Dal Tadka Combo', quantity: 5, price: 80 }],
    totalAmount: 400, paymentMethod: 'wallet', status: 'ready', createdAt: '2026-04-28T13:45:00Z',
  },
];

interface OrderState {
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string;
  updateStatus: (id: string, status: Order['status']) => void;
  cancelOrder: (id: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [...mockOrders],
      placeOrder: (order) => {
        const id = `ORD-${Date.now()}`;
        if (order.paymentMethod === 'wallet') {
          useEmployeeStore.getState().rechargeWallet(order.employeeId, -order.totalAmount);
        }
        set((s) => ({
          orders: [
            { ...order, id, createdAt: new Date().toISOString() },
            ...s.orders,
          ],
        }));
        return id;
      },
      updateStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      cancelOrder: (id) =>
        set((s) => {
          const order = s.orders.find((o) => o.id === id);
          if (order && order.paymentMethod === 'wallet') {
            useEmployeeStore.getState().rechargeWallet(order.employeeId, order.totalAmount);
          }
          return { orders: s.orders.filter((o) => o.id !== id) };
        }),
    }),
    { name: 'order-storage' }
  )
);
