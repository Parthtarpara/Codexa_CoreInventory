export const Badge = ({ status, className = '' }) => {
    const colorMap = {
        'In Stock': 'bg-success/10 text-success border border-success/20',
        'Low Stock': 'bg-warning/10 text-warning border border-warning/20 text-glow',
        'Out of Stock': 'bg-danger/10 text-danger border border-danger/20',
        'Completed': 'bg-success/10 text-success border border-success/20',
        'Pending': 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        'In Transit': 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
        'Delivered': 'bg-success/10 text-success border border-success/20',
        'Dispatched': 'bg-warning/10 text-warning border border-warning/20',
        'Partially Received': 'bg-warning/10 text-warning border border-warning/20',
        'Cancelled': 'bg-danger/10 text-danger border border-danger/20',
        'Active': 'bg-success/10 text-success border border-success/20',
        'Maintenance': 'bg-warning/10 text-warning border border-warning/20',
        'Full': 'bg-danger/10 text-danger border border-danger/20',
    };

    const badgeTheme = colorMap[status] || 'bg-elevated text-text-secondary border border-border';

    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${badgeTheme} ${className}`}>
            {status}
        </span>
    );
};
