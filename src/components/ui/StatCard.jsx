import { useCounter } from '../../hooks/useCounter';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const StatCard = ({ title, value, type = 'number', trend = 0, warning = false, danger = false }) => {
    const animatedValue = useCounter(value, 1.2);

    let borderColor = 'border-border';
    let glowClass = '';
    if (warning) {
        borderColor = 'border-warning';
        glowClass = 'shadow-[0_0_15px_rgba(255,140,0,0.15)]';
    } else if (danger) {
        borderColor = 'border-danger';
        glowClass = 'shadow-[0_0_15px_rgba(255,68,68,0.15)]';
    }

    const isPositive = trend > 0;
    const isNegative = trend < 0;

    const formattedVal = type === 'currency'
        ? `$${formatNumber(animatedValue.toFixed(2))}`
        : type === 'percentage'
            ? `${animatedValue.toFixed(1)}%`
            : Math.floor(animatedValue);

    return (
        <Card className={`relative overflow-hidden ${borderColor} ${glowClass}`}>
            <div className="flex flex-col gap-1">
                <span className="text-text-secondary text-sm font-medium">{title}</span>
                <div className="flex items-end justify-between mt-1">
                    <span className={`text-3xl font-orbitron font-bold ${danger ? 'text-danger text-glow' : warning ? 'text-warning text-glow' : 'text-white'
                        }`}>
                        {formattedVal}
                    </span>

                    {trend !== undefined && trend !== null && (
                        <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-success' : isNegative ? 'text-danger' : 'text-text-secondary'
                            }`}>
                            {isPositive ? <TrendingUp size={14} className="mr-1" /> :
                                isNegative ? <TrendingDown size={14} className="mr-1" /> :
                                    <Minus size={14} className="mr-1" />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
            </div>

            {/* Abstract background accent */}
            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 100V0L100 100H0Z" fill="currentColor" />
                </svg>
            </div>
        </Card>
    );
};
