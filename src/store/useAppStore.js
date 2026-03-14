import { create } from 'zustand';
import { users } from '../data/users';

export const useAppStore = create((set) => ({
    currentUser: users[0], // pre-login with admin
    isAuthenticated: true,
    login: (user) => set({ currentUser: user, isAuthenticated: true }),
    logout: () => set({ currentUser: null, isAuthenticated: false }),
}));
