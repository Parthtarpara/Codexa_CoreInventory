import dayjs from 'dayjs';

const types = ['Receipt', 'Delivery', 'Transfer', 'Adjustment'];
const statuses = ['Completed', 'Completed', 'Completed', 'Pending', 'In Transit'];

export const transactions = Array.from({ length: 50 }).map((_, i) => {
    const isRecent = i < 15;
    const dateStr = dayjs().subtract(isRecent ? i : Math.floor(Math.random() * 90), 'day')
        .subtract(Math.floor(Math.random() * 12), 'hour').toISOString();

    const type = types[Math.floor(Math.random() * types.length)];
    let qtyChange = Math.floor(Math.random() * 500) + 1;
    if (type === 'Delivery' || type === 'Adjustment') qtyChange = -qtyChange;

    return {
        id: `txn_${1000 + i}`,
        date: dateStr,
        type: type,
        productId: `prod_${Math.floor(Math.random() * 30) + 1}`,
        warehouseId: `wh_0${Math.floor(Math.random() * 5) + 1}`,
        qtyChange: qtyChange,
        balance: Math.floor(Math.random() * 5000),
        reference: `REF-${Math.floor(Math.random() * 9999)}`,
        user: `usr_0${Math.floor(Math.random() * 3) + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)]
    };
});
