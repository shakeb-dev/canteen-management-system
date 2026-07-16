export interface Employee {
  id: string;
  name: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  uniqueNumber: string;
  username: string;
  password?: string;
  role: 'super_admin' | 'canteen_supervisor' | 'counter_manager' | 'employee';
  department: string;
  walletBalance: number;
  email: string;
  phone?: string;
  isActive?: boolean;
  canteenId?: string;
}

export interface Canteen {
  id: string;
  name: string;
  managerId: string;
  isActive: boolean;
  location?: string;
}

export interface Counter {
  id: string;
  name: string;
  location: string;
  managerId: string;
  isActive: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface FoodItem {
  id: string;
  name: string; // ProductName
  price: number; // SalePrice
  category: string; // ProductCategoryName
  unitName: string; 
  shortCode: string;
  canteenId: string;
  description?: string;
  isFoodOfTheDay: boolean;
  isEnabled: boolean;
}

export interface CartItem extends FoodItem {
  cartItemId: string;
  quantity: number;
}

export interface Order {
  id: string;
  employeeId: string;
  employeeName: string;
  canteenId: string;
  canteenName: string;
  counterId?: string;
  counterName?: string;
  items: { foodItemId: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: 'wallet' | 'cash';
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
}
