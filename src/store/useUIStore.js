import { create } from 'zustand';

export const useUIStore = create((set) => ({
    sidebarExpanded: true,
    toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

    notificationsOpen: false,
    toggleNotifications: () => set((state) => ({ notificationsOpen: !state.notificationsOpen })),

    activeModal: null, // e.g. 'addProduct', 'receiveStock'
    openModal: (modalName) => set({ activeModal: modalName }),
    closeModal: () => set({ activeModal: null }),

    cursorHoverState: 'default',
    setCursorHoverState: (stateType) => set({ cursorHoverState: stateType }),

    introShown: false,
    setIntroShown: (val) => set({ introShown: val }),
}));
