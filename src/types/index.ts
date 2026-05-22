export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'resolved';
export type ItemCategory =
  | 'electronics'
  | 'clothing'
  | 'accessories'
  | 'documents'
  | 'keys'
  | 'pets'
  | 'bags'
  | 'wallet'
  | 'jewelry'
  | 'sports'
  | 'toys'
  | 'other';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed in a real app
  role: UserRole;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Item {
  id: string;
  type: ItemType;
  status: ItemStatus;
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  date: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  reward?: string;
  color?: string;
  brand?: string;
  postedBy: string; // user id
}

export interface ItemFormData {
  type: ItemType;
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  date: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  imageUrl?: string;
  reward?: string;
  color?: string;
  brand?: string;
}

export interface FilterState {
  type: ItemType | 'all';
  category: ItemCategory | 'all';
  status: ItemStatus | 'all';
  searchQuery: string;
  sortBy: 'newest' | 'oldest';
  dateFrom?: string;
  dateTo?: string;
}

export interface Stats {
  totalItems: number;
  lostItems: number;
  foundItems: number;
  resolvedItems: number;
  openItems: number;
}

export const CATEGORIES: { value: ItemCategory; label: string; icon: string }[] = [
  { value: 'electronics', label: 'Electronics', icon: '📱' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'accessories', label: 'Accessories', icon: '🕶️' },
  { value: 'documents', label: 'Documents', icon: '📄' },
  { value: 'keys', label: 'Keys', icon: '🔑' },
  { value: 'pets', label: 'Pets', icon: '🐾' },
  { value: 'bags', label: 'Bags & Luggage', icon: '👜' },
  { value: 'wallet', label: 'Wallet & Purse', icon: '👛' },
  { value: 'jewelry', label: 'Jewelry', icon: '💍' },
  { value: 'sports', label: 'Sports Equipment', icon: '⚽' },
  { value: 'toys', label: 'Toys', icon: '🧸' },
  { value: 'other', label: 'Other', icon: '📦' },
];
