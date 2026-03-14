import { BarChart3, TrendingUp, TrendingDown, Activity, RefreshCw, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { MovementBarChart } from '../../components/charts/MovementBarChart';
import { CategoryPieChart } from '../../components/charts/CategoryPieChart';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useInventoryStore } from '../../store/useInventoryStore';

export const AnalyticsPage = () => {
    const { products, transactions } = useInventoryStore();

    // Mock analytics calculations
    const totalValue = products.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);
    const turnoverRate = 4.2; // Mock
    const orderFulfillment = 98.5; // Mock
    const totalIn = transactions.filter(t => t.type === 'Receipt').reduce((acc, t) => acc + t.qtyChange, 0);
    const totalOut = transactions.filter(t => t.type === 'Delivery').reduce((acc, t) => acc + Math.abs(t.qtyChange), 0);

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide flex items-center">
                        <BarChart3 size={24} className="mr-3 text-accent-yellow" /> Analytics Intelligence
                    </h2>
                    <p className="text-text-secondary mt-1">Deep dive into performance metrics and movement trends.</p>
                </div>

                <Button variant="ghost" className="border-border">
                    <RefreshCw size={14} className="mr-2" /> Last 30 Days
                </Button>
            </div>

            {/* KPI Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-border flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 text-accent-yellow group-hover:scale-110 transition-transform"><Activity size={100} /></div>
                    <div className="text-sm text-text-secondary uppercase tracking-wider mb-2 z-10">Inventory Value Trajectory</div>
                    <div className="text-3xl font-orbitron font-bold text-white mb-2 z-10">${(totalValue / 1000).toFixed(1)}k</div>
                    <div className="flex items-center text-sm font-medium text-success z-10">
                        <TrendingUp size={16} className="mr-1" /> +12.5% vs last month
                    </div>
                </Card>

                <Card className="border-border flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 text-accent-yellow group-hover:scale-110 transition-transform"><RefreshCw size={100} /></div>
                    <div className="text-sm text-text-secondary uppercase tracking-wider mb-2 z-10">Stock Turnover Rate</div>
                    <div className="text-3xl font-orbitron font-bold text-white mb-2 z-10">{turnoverRate}</div>
                    <div className="flex items-center text-sm font-medium text-success z-10">
                        <TrendingUp size={16} className="mr-1" /> +0.4 vs last month
                    </div>
                </Card>

                <Card className="border-border flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 text-accent-yellow group-hover:scale-110 transition-transform"><ArrowDownToLine size={100} /></div>
                    <div className="text-sm text-text-secondary uppercase tracking-wider mb-2 z-10">Total Inbound</div>
                    <div className="text-3xl font-orbitron font-bold text-white mb-2 z-10">{totalIn.toLocaleString()}</div>
                    <div className="flex items-center text-sm font-medium text-danger z-10">
                        <TrendingDown size={16} className="mr-1" /> -5.2% vs last month
                    </div>
                </Card>

                <Card className="border-border flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 text-accent-yellow group-hover:scale-110 transition-transform"><ArrowUpFromLine size={100} /></div>
                    <div className="text-sm text-text-secondary uppercase tracking-wider mb-2 z-10">Fulfillment Rate</div>
                    <div className="text-3xl font-orbitron font-bold text-white mb-2 z-10">{orderFulfillment}%</div>
                    <div className="flex items-center text-sm font-medium text-success z-10">
                        <TrendingUp size={16} className="mr-1" /> +1.1% vs last month
                    </div>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="h-[400px]">
                    <MovementBarChart />
                </div>
                <div className="h-[400px]">
                    <CategoryPieChart />
                </div>
            </div>

        </PageWrapper>
    );
};
