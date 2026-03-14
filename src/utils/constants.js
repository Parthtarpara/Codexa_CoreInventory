export const COLORS = {
    primary: '#0a0a0a',
    surface: '#111111',
    elevated: '#161616',
    yellow: '#F5C400',
    grey: '#8a8a8a',
    text: '#ffffff',
    textSecondary: '#6b6b6b',
    border: '#1f1f1f',
    danger: '#FF4444',
    success: '#00C48C',
    warning: '#FF8C00'
};

export const STATUS_COLORS = {
    'In Stock': COLORS.success,
    'Low Stock': COLORS.warning,
    'Out of Stock': COLORS.danger,
    'Completed': COLORS.grey,
    'Pending': COLORS.yellow,
    'In Transit': COLORS.yellow,
    'Delivered': COLORS.success,
    'Dispatched': COLORS.warning,
    'Partially Received': COLORS.warning,
    'Cancelled': COLORS.danger,
    'Active': COLORS.success,
    'Maintenance': COLORS.warning,
    'Full': COLORS.danger,
};
