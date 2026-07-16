# 🍽️ Canteen Management System — CLAUDE.md

> **AI Context File** · React.js + TypeScript + Tailwind CSS  
> Use this file to guide Claude (or any AI assistant) with full project context.

---

## 📌 Project Overview

A digital **Canteen Management System** for managing employee food ordering, canteen operations, payments, and admin reporting.

| Property | Value |
|---|---|
| Type | Web + Mobile-Responsive App |
| Frontend | React.js + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Data Fetching | TanStack Query + Axios |
| Forms | React Hook Form + Zod |
| Routing | React Router DOM |

---

## 🏗️ Tech Stack

### Core
- **React.js + TypeScript** — UI + type safety
- **Tailwind CSS** — Responsive, utility-first styling

### Key Libraries
| Library | Purpose |
|---|---|
| `react-router-dom` | Page navigation |
| `react-hook-form` + `zod` | Forms + schema validation |
| `@tanstack/react-query` | Server state + caching |
| `zustand` | Global client state |
| `axios` | HTTP requests |
| `react-hot-toast` | Toast notifications |
| `dayjs` | Date formatting/handling |
| `lucide-react` | Icon library |
| `shadcn/ui` | Ready-made UI components (optional) |
| `sweetalert2` | Confirmation dialogs |

---

## 🗂️ Project Architecture

```
src/
├── app/                    # App-level setup (Router, QueryClient, Zustand)
├── assets/                 # Images, fonts, static files
├── components/             # Reusable UI components
│   ├── ui/                 # Button, Input, Modal, Table, Card, Badge
│   ├── layout/             # Sidebar, Navbar, PageWrapper
│   └── shared/             # Loader, EmptyState, Pagination, SearchBar
├── features/               # Feature-based modules
│   ├── auth/               # Login pages + auth logic
│   ├── admin/              # Admin panel features
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── employees/
│   │   ├── canteens/
│   │   ├── menu/
│   │   └── reports/
│   └── employee/           # Employee app features
│       ├── dashboard/
│       ├── canteens/
│       ├── menu/
│       ├── cart/
│       ├── orders/
│       └── reports/
├── hooks/                  # Custom hooks (useAuth, usePagination, useDebounce)
├── lib/                    # axios instance, query client config
├── mock/                   # Mock data (JSON / TS files)
├── store/                  # Zustand stores
├── types/                  # Global TypeScript types/interfaces
├── utils/                  # Helpers (formatCurrency, formatDate, exportPDF)
└── main.tsx
```

---

## 🔐 Authentication Flow

### Roles
| Role | Login Redirect |
|---|---|
| `admin` | `/admin/dashboard` |
| `canteen_manager` | `/canteen/dashboard` |
| `employee` | `/employee/dashboard` |

### Rules
- JWT stored in `localStorage` / `httpOnly cookie`
- Zustand `useAuthStore` holds `{ user, token, role }`
- Protected routes via `<PrivateRoute role="admin" />` wrapper
- Redirect to `/login` if unauthenticated

---

## 🧑‍💻 Admin Panel — Pages & Features

### 🏠 Dashboard
- KPI Cards: Total Employees, Orders Today, Revenue (Cash / Online), Active Canteens
- Quick reports overview (chart or summary table)

### 👥 User Management
- CRUD: Add / Edit / Delete users
- Assign roles: `Admin`, `Canteen Manager`
- Export list → PDF / Excel

### 👷 Employee Management
- CRUD: Add / Edit / Delete employees
- Import via Excel / API
- View wallet balance & credits
- Export → PDF / Excel

### 🍽️ Canteen Management
- CRUD: Add / Edit / Delete canteens
- Assign Canteen Manager
- Toggle Active / Inactive status

### 🍛 Food Menu Management
- Add food items with price
- Assign item to canteen
- Categories: `Breakfast` | `Lunch` | `Dinner` | `Snacks`
- Mark as ⭐ Food of the Day
- Enable / Disable items

### 📊 Reports & Tracking
- Canteen-wise sales
- Daily / Monthly reports
- Order-wise breakdown
- Payment tracking: `Wallet` | `Cash`
- Export → PDF / Excel

---

## 📱 Employee App — Pages & Features (Mobile-First)

### 🏠 Dashboard
- Wallet balance card
- Today's menu preview
- Quick Order button
- Recent orders list

### 🏢 Canteens
- List available canteens
- Select canteen to browse menu

### 🍴 Food Menu
- View items with price
- Filter by category
- ⭐ Food of the Day badge

### 🛒 Order Flow
1. Select item → Set quantity
2. Add to cart
3. Review cart + total
4. Place order (SweetAlert2 confirmation)
5. Toast notification on success

### 📦 Order Management
- Order statuses: `Pending` → `Preparing` → `Ready`
- Real-time-like status updates (polling or mock)
- Notification when order is ready

### 📑 Order History
- Date-wise order history
- Total spend summary
- Export → PDF / Excel

---

## 🔄 System Flow (End-to-End)

```
Admin Setup
  └─ Add Employees → Add Canteens → Add Food Menu

Employee Action
  └─ Login → Select Canteen → Browse Menu → Add to Cart → Place Order

Canteen Action
  └─ Receive Order → Prepare → Mark as Ready

Employee Pickup
  └─ Gets Notification → Picks up food

Admin Reporting
  └─ Tracks Orders → Revenue → Reports
```

---

## 🎨 UI/UX Standards

| Rule | Detail |
|---|---|
| Design approach | Mobile-first, responsive |
| Color scheme | Support Dark / Light mode |
| Tables | Compact, with search + pagination |
| Loading states | Skeleton loaders or spinners on every async action |
| Empty states | Custom `<EmptyState />` component |
| Confirmations | SweetAlert2 for destructive actions |
| Notifications | `react-hot-toast` for all API feedback |

---

## 🧩 Reusable Components Checklist

```tsx
<Button />          // variant: primary | secondary | danger | ghost
<Input />           // with error state, label, helper text
<Modal />           // controlled open/close with backdrop
<Table />           // sortable, compact, with pagination slot
<Card />            // stat card + content card variants
<Badge />           // status badge (Pending / Preparing / Ready)
<Loader />          // full-page + inline variants
<EmptyState />      // icon + message + optional CTA
<Pagination />      // prev/next + page numbers
<SearchBar />       // debounced input
<ConfirmDialog />   // SweetAlert2 wrapper
<ExportButton />    // PDF / Excel trigger
```

---

## 📐 TypeScript — Key Interfaces

```ts
// Auth
interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'canteen_manager' | 'employee';
}

// Employee
interface Employee {
  id: string;
  name: string;
  department: string;
  walletBalance: number;
  email: string;
}

// Canteen
interface Canteen {
  id: string;
  name: string;
  managerId: string;
  isActive: boolean;
}

// Food Item
interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  canteenId: string;
  isFoodOfTheDay: boolean;
  isEnabled: boolean;
}

// Order
interface Order {
  id: string;
  employeeId: string;
  canteenId: string;
  items: { foodItemId: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: 'wallet' | 'cash';
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
}
```

---

## 🗃️ Zustand Stores

```ts
// useAuthStore
{ user, token, role, login(), logout() }

// useCartStore
{ items, addItem(), removeItem(), clearCart(), totalAmount }

// useThemeStore
{ theme: 'light' | 'dark', toggleTheme() }
```

---

## 🌐 API Structure (Mock / Real)

```
POST   /api/auth/login
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id

GET    /api/canteens
POST   /api/canteens

GET    /api/menu?canteenId=&category=
POST   /api/menu

POST   /api/orders
GET    /api/orders?employeeId=&date=
PATCH  /api/orders/:id/status

GET    /api/reports/daily
GET    /api/reports/canteen/:id
```

---

## ⚡ Performance Guidelines

- Lazy load all route-level components (`React.lazy + Suspense`)
- Cache API calls with TanStack Query (`staleTime`, `cacheTime`)
- Debounce search inputs (300ms)
- Paginate all lists (default: 10 per page)
- Memoize heavy components with `React.memo` / `useMemo`

---

## 🧪 Mock Data Strategy

- All mock data in `src/mock/` as `.ts` files exporting typed arrays
- Use TanStack Query with a mock adapter or `msw` for realistic loading states
- Simulate API delay: `await new Promise(res => setTimeout(res, 800))`

---

## ✅ Dev Checklist

- [ ] Auth guards on all protected routes
- [ ] Loader on every API call
- [ ] Error boundary at app root
- [ ] Form validation with Zod on all forms
- [ ] SweetAlert2 on all delete/destructive actions
- [ ] Toast on all success/error responses
- [ ] Dark/light mode toggle wired to `useThemeStore`
- [ ] Export (PDF/Excel) on all report pages
- [ ] Mobile-responsive tested at 375px, 768px, 1280px
- [ ] TypeScript strict mode — no `any`

---

*Last updated: April 2026 · Stack: React 18 + TypeScript + Tailwind CSS*
