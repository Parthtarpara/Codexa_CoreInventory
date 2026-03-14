import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { COLORS } from '../../utils/constants';
import { useInventoryStore } from '../../store/useInventoryStore';

const pieColors = [
    COLORS.yellow,
    '#d4aa00',
    '#a38300',
    '#ffffff',
    '#cccccc',
    '#999999',
    '#666666',
    '#333333'
];

export const CategoryPieChart = () => {
    const categories = useInventoryStore(s => s.categories);

    // Create mock distribution based on categories
    const data = categories.map((cat, i) => ({
        name: cat.name,
        value: Math.floor(Math.random() * 50000) + 5000
    })).sort((a, b) => b.value - a.value);

    return (
        <Card className="w-full h-full min-h-[300px] flex flex-col">
            <h3 className="text-white font-medium mb-4">Categories Distribution</h3>
            <div className="flex-1 w-full min-h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.border, color: COLORS.text }}
                            itemStyle={{ color: COLORS.yellow }}
                            formatter={(value) => [`${value.toLocaleString()} units`, 'Stock']}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 mt-2">
                {data.slice(0, 4).map((entry, index) => (
                    <div key={entry.name} className="flex items-center text-xs">
                        <span
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: pieColors[index % pieColors.length] }}
                        />
                        <span className="text-text-secondary truncate">{entry.name}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
