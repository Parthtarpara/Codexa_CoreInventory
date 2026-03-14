import { create } from 'zustand';
import { users } from '../data/users';

export const useAppStore = create((set) => ({
    currentUser: null,
    isAuthenticated: false,
    login: (user) => set({ currentUser: user, isAuthenticated: true }),
    logout: () => set({ currentUser: null, isAuthenticated: false }),
}));
