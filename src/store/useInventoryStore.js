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

    addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
}));
