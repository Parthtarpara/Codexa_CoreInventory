import dayjs from 'dayjs';

export const orders = {
    receipts: Array.from({ length: 20 }).map((_, i) => ({
        id: `PO-${2000 + i}`,
        supplier: `Supplier ${String.fromCharCode(65 + (i % 5))} Corp`,
        date: dayjs().subtract(Math.floor(Math.random() * 30), 'day').toISOString(),
        items: Math.floor(Math.random() * 10) + 1,
        totalValue: Math.floor(Math.random() * 50000) + 1000,
        status: ['Pending', 'Completed', 'Completed', 'Partially Received', 'Cancelled'][Math.floor(Math.random() * 5)]
    })),
    deliveries: Array.from({ length: 20 }).map((_, i) => ({
        id: `DO-${5000 + i}`,
        customer: `Client ${String.fromCharCode(88 - (i % 5))} Industries`,
        date: dayjs().subtract(Math.floor(Math.random() * 30), 'day').toISOString(),
        items: Math.floor(Math.random() * 5) + 1,
        totalValue: Math.floor(Math.random() * 20000) + 500,
        status: ['Pending', 'Dispatched', 'Delivered', 'Delivered', 'Cancelled'][Math.floor(Math.random() * 5)]
    }))
};
