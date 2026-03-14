import { useMemo } from 'react';
import { Package, AlertTriangle, ArrowRight, Server, Box } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useUIStore } from '../../store/useUIStore';

export const StockOverviewPage = () => {
    const { products, categories, warehouses } = useInventoryStore();
    const setHover = useUIStore(s => s.setCursorHoverState);

    const outOfStock = products.filter(p => p.quantity === 0);
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.reorderPoint);

    const categoryStats = useMemo(() => {
        return categories.map(cat => {
            const catProducts = products.filter(p => p.category === cat.id);
            const totalQty = catProducts.reduce((acc, p) => acc + p.quantity, 0);
            const totalValue = catProducts.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);
            const lowCount = catProducts.filter(p => p.quantity <= p.reorderPoint).length;

            return { ...cat, totalQty, totalValue, lowCount, productCount: catProducts.length };
        }).sort((a, b) => b.totalValue - a.totalValue);
    }, [categories, products]);

    const alertColumns = [
        { accessorKey: 'sku', header: 'SKU', cell: info => <span className="font-orbitron font-medium">{info.getValue()}</span> },
        { accessorKey: 'name', header: 'Product Name' },
        { accessorKey: 'warehouse', header: 'Location', cell: info => warehouses.find(w => w.id === info.getValue())?.name || info.getValue() },
        { accessorKey: 'quantity', header: 'Current Qty', cell: info => <span className={`font-orbitron font-bold ${info.getValue() === 0 ? 'text-danger' : 'text-warning'}`}>{info.getValue()}</span> },
        { accessorKey: 'reorderPoint', header: 'Reorder At', cell: info => <span className="font-orbitron text-text-secondary">{info.getValue()}</span> },
        { accessorKey: 'status', header: 'Status', cell: info => <Badge status={info.getValue()} /> }
    ];

    return (
        <PageWrapper>
            <div className="mb-8">
                <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">Network Stock Health</h2>
                <p className="text-text-secondary">Cross-facility inventory valuation and critical level tracking.</p>
            </div>

            {/* Critical Alerts Banner */}
            {(outOfStock.length > 0 || lowStock.length > 0) && (
                <div className="bg-warning/10 border border-warning/30 p-4 rounded flex items-center justify-between mb-8 shadow-[inset_0_0_20px_rgba(255,152,0,0.05)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-warning/20 rounded text-warning">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-warning">Action Required</h3>
                            <p className="text-sm text-warning/80">
                                Found {outOfStock.length} items out of stock and {lowStock.length} running low across the network.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Breakdown Grid */}
            <h3 className="text-lg font-orbitron font-medium text-white mb-4 flex items-center">
                <Server size={18} className="mr-2 text-accent-yellow" /> Valuation by Category
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {categoryStats.map((cat, i) => (
                    <Card key={cat.id} interactive glowOnHover className="flex flex-col h-full border-border hover:border-accent-yellow/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-primary border border-border flex items-center justify-center text-accent-yellow">
                                    <Box size={14} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white leading-tight">{cat.name}</h4>
                                    <p className="text-[10px] text-text-secondary uppercase">{cat.productCount} SKUs</p>
                                </div>
                            </div>
                            {cat.lowCount > 0 && (
                                <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded border border-warning/20">
                                    {cat.lowCount} Alerts
                                </span>
                            )}
                        </div>

                        <div className="mt-auto space-y-2">
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-xs text-text-secondary">Total Units</span>
                                <span className="font-orbitron font-bold text-white">{cat.totalQty.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-xs text-text-secondary">Asset Value</span>
                                <span className="font-orbitron font-bold text-accent-yellow">${cat.totalValue.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Critical Stock Table */}
            <h3 className="text-lg font-orbitron font-medium text-white mb-4 flex items-center">
                <Package size={18} className="mr-2 text-accent-yellow" /> Critical Replenishment Needed
            </h3>

            <Card className="p-0 overflow-hidden border-warning/20">
                <Table
                    data={[...outOfStock, ...lowStock]}
                    columns={alertColumns}
                    pageSize={5}
                />
            </Card>
        </PageWrapper>
    );
};
