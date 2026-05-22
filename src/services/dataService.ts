import { v4 as uuidv4 } from 'uuid';
import { Item, ItemFormData, FilterState, Stats } from '../types';

const STORAGE_KEY = 'community_lost_found_items_v2';

const seedData: Item[] = [
  {
    id: uuidv4(),
    type: 'lost',
    status: 'open',
    title: 'Black iPhone 15 Pro',
    description: 'Lost my black iPhone 15 Pro near the central park fountain area. It has a clear case with a small sticker on the back. Lock screen shows a sunset photo. Very important — contains irreplaceable photos.',
    category: 'electronics',
    location: 'Rizal Park, near the fountain',
    date: '2025-12-15',
    contactName: 'Sarah Santos',
    contactEmail: 'sarah.s@email.com',
    contactPhone: '0917-123-4567',
    createdAt: '2025-12-15T10:30:00Z',
    updatedAt: '2025-12-15T10:30:00Z',
    reward: '₱5,000',
    color: 'Black',
    brand: 'Apple',
    postedBy: 'user-001',
  },
  {
    id: uuidv4(),
    type: 'found',
    status: 'open',
    title: 'Set of Car Keys with Red Keychain',
    description: 'Found a set of car keys (looks like Toyota) with a distinctive red leather keychain and a small Swiss Army knife attachment. Found on a bench near the bus stop.',
    category: 'keys',
    location: 'Main Street Bus Stop, Quezon City',
    date: '2025-12-14',
    contactName: 'Mike Reyes',
    contactEmail: 'mike.r@email.com',
    contactPhone: '0918-234-5678',
    createdAt: '2025-12-14T14:20:00Z',
    updatedAt: '2025-12-14T14:20:00Z',
    color: 'Silver with red keychain',
    brand: 'Toyota',
    postedBy: 'admin-001',
  },
  {
    id: uuidv4(),
    type: 'lost',
    status: 'open',
    title: 'Golden Retriever - "Buddy"',
    description: 'Our beloved Golden Retriever "Buddy" went missing from our backyard. He is 3 years old, very friendly, wearing a blue collar with tags. Please contact us immediately if found!',
    category: 'pets',
    location: 'Brgy. San Roque, Marikina City',
    date: '2025-12-13',
    contactName: 'The Garcia Family',
    contactEmail: 'garcia.family@email.com',
    contactPhone: '0919-345-6789',
    createdAt: '2025-12-13T08:00:00Z',
    updatedAt: '2025-12-13T08:00:00Z',
    reward: '₱10,000',
    color: 'Golden',
    brand: '',
    postedBy: 'user-001',
  },
  {
    id: uuidv4(),
    type: 'found',
    status: 'open',
    title: 'Brown Leather Wallet',
    description: 'Found a brown leather wallet in the parking lot of SM City on Oak Avenue. Contains some cards and cash. Owner can claim by describing the contents.',
    category: 'wallet',
    location: 'SM City Parking Lot, Manila',
    date: '2025-12-12',
    contactName: 'David Cruz',
    contactEmail: 'david.c@email.com',
    contactPhone: '0920-456-7890',
    createdAt: '2025-12-12T16:45:00Z',
    updatedAt: '2025-12-12T16:45:00Z',
    color: 'Brown',
    brand: 'Coach',
    postedBy: 'admin-001',
  },
  {
    id: uuidv4(),
    type: 'lost',
    status: 'resolved',
    title: 'Blue Backpack with Laptop',
    description: 'Left my blue North Face backpack at the library study area. Contains a Dell laptop, charger, notebook, and textbooks. Already found and returned!',
    category: 'bags',
    location: 'City Public Library, 2nd Floor',
    date: '2025-12-10',
    contactName: 'Alex Rivera',
    contactEmail: 'alex.r@email.com',
    contactPhone: '0921-567-8901',
    createdAt: '2025-12-10T11:15:00Z',
    updatedAt: '2025-12-11T09:00:00Z',
    color: 'Blue',
    brand: 'North Face',
    postedBy: 'user-001',
  },
  {
    id: uuidv4(),
    type: 'found',
    status: 'open',
    title: 'Prescription Glasses in Black Case',
    description: 'Found prescription glasses in a black hard case on the bench at Riverside Park. The frames are tortoiseshell colored. Please contact if these are yours.',
    category: 'accessories',
    location: 'Luneta Park, near playground',
    date: '2025-12-11',
    contactName: 'Emma Tan',
    contactEmail: 'emma.t@email.com',
    contactPhone: '0922-678-9012',
    createdAt: '2025-12-11T13:30:00Z',
    updatedAt: '2025-12-11T13:30:00Z',
    color: 'Tortoiseshell',
    postedBy: 'admin-001',
  },
  {
    id: uuidv4(),
    type: 'lost',
    status: 'open',
    title: 'Silver Charm Bracelet',
    description: 'Lost a silver charm bracelet with 8 charms including a heart, star, and moon. Great sentimental value — was a gift from my lola. Last seen at the coffee shop.',
    category: 'jewelry',
    location: 'Starbucks on Ayala Avenue',
    date: '2025-12-16',
    contactName: 'Jessica Lim',
    contactEmail: 'jessica.l@email.com',
    contactPhone: '0923-789-0123',
    createdAt: '2025-12-16T09:00:00Z',
    updatedAt: '2025-12-16T09:00:00Z',
    reward: '₱2,000',
    color: 'Silver',
    postedBy: 'user-001',
  },
  {
    id: uuidv4(),
    type: 'found',
    status: 'resolved',
    title: 'Child\'s Stuffed Bear',
    description: 'Found a well-loved brown teddy bear at the community playground. Has a small red bow tie. Returned to the owner!',
    category: 'toys',
    location: 'Community Playground, Brgy. San Antonio',
    date: '2025-12-09',
    contactName: 'Karen Bautista',
    contactEmail: 'karen.b@email.com',
    contactPhone: '0924-890-1234',
    createdAt: '2025-12-09T15:00:00Z',
    updatedAt: '2025-12-10T10:00:00Z',
    color: 'Brown',
    postedBy: 'admin-001',
  },
];

function getItems(): Item[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(stored);
}

function saveItems(items: Item[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const dataService = {
  getAllItems(): Item[] {
    return getItems();
  },

  getItemById(id: string): Item | undefined {
    return getItems().find(item => item.id === id);
  },

  createItem(formData: ItemFormData, userId: string): Item {
    const items = getItems();
    const now = new Date().toISOString();
    const newItem: Item = {
      ...formData,
      id: uuidv4(),
      status: 'open',
      createdAt: now,
      updatedAt: now,
      postedBy: userId,
    };
    items.unshift(newItem);
    saveItems(items);
    return newItem;
  },

  updateItem(id: string, formData: Partial<ItemFormData>): Item | undefined {
    const items = getItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    items[index] = {
      ...items[index],
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    saveItems(items);
    return items[index];
  },

  deleteItem(id: string): boolean {
    const items = getItems();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    saveItems(filtered);
    return true;
  },

  toggleStatus(id: string): Item | undefined {
    const items = getItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    items[index].status = items[index].status === 'open' ? 'resolved' : 'open';
    items[index].updatedAt = new Date().toISOString();
    saveItems(items);
    return items[index];
  },

  getFilteredItems(filters: FilterState): Item[] {
    let items = getItems();
    if (filters.type !== 'all') items = items.filter(item => item.type === filters.type);
    if (filters.category !== 'all') items = items.filter(item => item.category === filters.category);
    if (filters.status !== 'all') items = items.filter(item => item.status === filters.status);
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.color && item.color.toLowerCase().includes(query)) ||
        (item.brand && item.brand.toLowerCase().includes(query))
      );
    }
    if (filters.dateFrom) items = items.filter(item => item.date >= filters.dateFrom!);
    if (filters.dateTo) items = items.filter(item => item.date <= filters.dateTo!);
    items.sort((a, b) => {
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return items;
  },

  getStats(): Stats {
    const items = getItems();
    return {
      totalItems: items.length,
      lostItems: items.filter(i => i.type === 'lost').length,
      foundItems: items.filter(i => i.type === 'found').length,
      resolvedItems: items.filter(i => i.status === 'resolved').length,
      openItems: items.filter(i => i.status === 'open').length,
    };
  },

  getRecentItems(limit: number = 6): Item[] {
    return getItems()
      .filter(i => i.status === 'open')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  getItemsByUser(userId: string): Item[] {
    return getItems()
      .filter(i => i.postedBy === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  resetData(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  },
};
