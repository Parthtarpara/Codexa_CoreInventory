import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';
import { COLORS } from '../../utils/constants';

// Generate last 7 days movement
const data = Array.from({ length: 7 }).map((_, i) => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    in: Math.floor(Math.random() * 5000) + 1000,
    out: Math.floor(Math.random() * 4000) + 800,
}));

export const MovementBarChart = () => {
    return (
        <Card className="w-full h-full min-h-[300px] flex flex-col">
            <h3 className="text-white font-medium mb-4">Weekly Movement (In vs Out)</h3>
            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                        <XAxis dataKey="name" stroke={COLORS.textSecondary} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={COLORS.textSecondary} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                        <Tooltip
                            cursor={{ fill: COLORS.elevated }}
                            contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
                            labelStyle={{ color: COLORS.textSecondary }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', color: COLORS.textSecondary }} />
                        <Bar dataKey="in" name="Stock In" fill={COLORS.yellow} radius={[2, 2, 0, 0]} animationDuration={1500} />
                        <Bar dataKey="out" name="Stock Out" fill={COLORS.grey} radius={[2, 2, 0, 0]} animationDuration={1500} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
