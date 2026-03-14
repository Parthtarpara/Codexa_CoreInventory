import dayjs from 'dayjs';

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
};

export const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
};

export const formatDate = (dateStr, format = 'DD MMM YYYY') => {
    return dayjs(dateStr).format(format);
};

export const formatDateTime = (dateStr) => {
    return dayjs(dateStr).format('DD MMM YYYY, HH:mm');
};
