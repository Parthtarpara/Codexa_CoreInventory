export const Spinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-10 h-10'
    };

    return (
        <div className={`relative ${sizes[size]} ${className}`}>
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            <div className="absolute inset-0 rounded-full border-2 border-accent-yellow border-t-transparent animate-spin" />
        </div>
    );
};
