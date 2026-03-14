import { create } from 'zustand';
import { products } from '../data/products';
import { warehouses } from '../data/warehouses';
import { categories } from '../data/categories';
import { transactions } from '../data/transactions';
import { orders } from '../data/orders';

export const useInventoryStore = create((set) => ({
    products: products,
    warehouses: warehouses,
    categories: categories,
    transactions: transactions,
    receipts: orders.receipts,
    deliveries: orders.deliveries,

    addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
    updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
    })),
    deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
    })),

    addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
    updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
    })),
    deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
    })),

    addWarehouse: (warehouse) => set((state) => ({ warehouses: [...state.warehouses, warehouse] })),
    updateWarehouse: (id, updates) => set((state) => ({
        warehouses: state.warehouses.map(w => w.id === id ? { ...w, ...updates } : w)
    })),
    deleteWarehouse: (id) => set((state) => ({
        warehouses: state.warehouses.filter(w => w.id !== id)
    })),

    addReceipt: (receipt) => set((state) => ({ receipts: [receipt, ...state.receipts] })),
    updateReceipt: (id, updates) => set((state) => ({
        receipts: state.receipts.map(r => r.id === id ? { ...r, ...updates } : r)
    })),
    deleteReceipt: (id) => set((state) => ({
        receipts: state.receipts.filter(r => r.id !== id)
    })),

    addDelivery: (delivery) => set((state) => ({ deliveries: [delivery, ...state.deliveries] })),
    updateDelivery: (id, updates) => set((state) => ({
        deliveries: state.deliveries.map(d => d.id === id ? { ...d, ...updates } : d)
    })),
    deleteDelivery: (id) => set((state) => ({
        deliveries: state.deliveries.filter(d => d.id !== id)
    })),

    addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
    updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
    })),
    deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
    })),
}));
