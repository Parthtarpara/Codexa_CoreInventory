import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { COLORS } from '../../utils/constants';

const data = [
    { subject: 'Mumbai Hub', capacity: 150, used: 135 },
    { subject: 'Delhi North', capacity: 100, used: 98 },
    { subject: 'Bangalore', capacity: 120, used: 45 },
    { subject: 'Chennai', capacity: 200, used: 110 },
    { subject: 'Pune Ind', capacity: 80, used: 0 },
];

export const WarehouseRadar = () => {
    return (
        <Card className="w-full h-full min-h-[300px] flex flex-col">
            <h3 className="text-white font-medium mb-4">Capacity Utilization (k units)</h3>
            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke={COLORS.border} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: COLORS.textSecondary, fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 200]} tick={false} axisLine={false} />
                        <Radar name="Total Capacity" dataKey="capacity" stroke={COLORS.grey} fill={COLORS.grey} fillOpacity={0.2} animationDuration={1500} />
                        <Radar name="Used Capacity" dataKey="used" stroke={COLORS.yellow} fill={COLORS.yellow} fillOpacity={0.5} animationDuration={1500} />
                        <Tooltip
                            contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
                            itemStyle={{ color: COLORS.text }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
