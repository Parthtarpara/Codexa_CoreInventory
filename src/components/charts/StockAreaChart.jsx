import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { COLORS } from '../../utils/constants';

// Mock data generator for 30 days
const data = Array.from({ length: 30 }).map((_, i) => ({
    date: `Day ${i + 1}`,
    stock: 120000 + Math.floor(Math.sin(i / 3) * 15000) + Math.random() * 5000
}));

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface border border-accent-yellow p-3 shadow-[0_0_15px_rgba(245,196,0,0.15)] text-sm">
                <p className="text-text-secondary mb-1">{label}</p>
                <p className="text-accent-yellow font-bold font-orbitron">{payload[0].value.toLocaleString()} units</p>
            </div>
        );
    }
    return null;
};

export const StockAreaChart = () => {
    return (
        <Card className="w-full h-full min-h-[300px] flex flex-col">
            <h3 className="text-white font-medium mb-4">Stock Levels (30 Days)</h3>
            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.yellow} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS.yellow} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                        <XAxis dataKey="date" stroke={COLORS.textSecondary} fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
                        <YAxis stroke={COLORS.textSecondary} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="stock"
                            stroke={COLORS.yellow}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorStock)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
