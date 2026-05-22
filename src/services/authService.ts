import { v4 as uuidv4 } from 'uuid';
import { User, AuthUser, UserRole } from '../types';

const USERS_KEY = 'neighborfind_users';
const SESSION_KEY = 'neighborfind_session';

// Default admin & user accounts
const defaultUsers: User[] = [
  {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@neighborfind.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'user-001',
    name: 'Juan Dela Cruz',
    email: 'juan@email.com',
    password: 'user123',
    role: 'user',
    createdAt: '2025-06-01T00:00:00Z',
  },
];

function getUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toAuthUser(user: User): AuthUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export const authService = {
  login(email: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'No account found with that email.' };
    if (user.password !== password) return { success: false, error: 'Incorrect password.' };
    const authUser = toAuthUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    return { success: true, user: authUser };
  },

  register(name: string, email: string, password: string, role: UserRole = 'user'): { success: boolean; user?: AuthUser; error?: string } {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with that email already exists.' };
    }
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    const authUser = toAuthUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    return { success: true, user: authUser };
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser(): AuthUser | null {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },

  getAllUsers(): AuthUser[] {
    return getUsers().map(toAuthUser);
  },
};
