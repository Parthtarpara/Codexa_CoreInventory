import { useState, useMemo } from 'react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    ArrowRightLeft,
    SlidersHorizontal,
    Plus,
    Search,
    Filter,
    Eye,
    FileCheck2
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useSearch } from '../../hooks/useSearch';
import { formatDate } from '../../utils/formatters';

export const OperationsPage = ({ type }) => {
    // Config based on type
    const config = {
        receipts: {
            title: 'Inbound Receipts',
            desc: 'Manage incoming supply, vendor POs, and GRNs.',
            icon: <ArrowDownToLine size={24} className="text-success" />,
            actionText: 'New Receipt',
            dataKey: 'receipts', // from store
            color: 'text-success'
        },
        deliveries: {
            title: 'Outbound Deliveries',
            desc: 'Track customer orders, dispatch, and shipping DOs.',
            icon: <ArrowUpFromLine size={24} className="text-danger" />,
            actionText: 'New Delivery',
            dataKey: 'deliveries',
            color: 'text-danger'
        },
        transfers: {
            title: 'Internal Transfers',
            desc: 'Monitor stock movement between network warehouses.',
            icon: <ArrowRightLeft size={24} className="text-warning" />,
            actionText: 'Request Transfer',
            dataKey: 'transactions', // Filter transactions for 'Transfer'
            color: 'text-warning'
        },
        adjustments: {
            title: 'Stock Adjustments',
            desc: 'Log reconciliations, damages, and manual counts.',
            icon: <SlidersHorizontal size={24} className="text-accent-yellow" />,
            actionText: 'Log Adjustment',
            dataKey: 'transactions', // Filter transactions for 'Adjustment'
            color: 'text-accent-yellow'
        }
    }[type];

    const store = useInventoryStore();
    const [searchTerm, setSearchTerm, debouncedTerm] = useSearch('', 300);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get and filter data
    const data = useMemo(() => {
        let rawData = [];
        if (type === 'receipts' || type === 'deliveries') {
            rawData = store[config.dataKey] || [];
        } else {
            rawData = store.transactions?.filter(t => t.type.toLowerCase() === type.slice(0, -1)) || [];
        }

        return rawData.filter(item => {
            const searchStr = `${item.id || ''} ${item.reference || ''} ${item.supplier || item.customer || ''}`.toLowerCase();
            return searchStr.includes(debouncedTerm.toLowerCase());
        });
    }, [store, type, config.dataKey, debouncedTerm]);

    // Dynamic Columns
    const columns = useMemo(() => {
        const baseCols = [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: info => <span className="font-orbitron font-medium text-white">{info.getValue()}</span>
            },
            {
                accessorKey: 'date',
                header: 'Date',
                cell: info => <span className="text-text-secondary">{formatDate(info.getValue(), 'DD MMM YYYY')}</span>
            }
        ];

        if (type === 'receipts') {
            baseCols.push(
                { accessorKey: 'reference', header: 'Reference PO', cell: info => <span className="font-orbitron text-accent-yellow">{info.getValue()}</span> },
                { accessorKey: 'supplier', header: 'Supplier' },
                { accessorKey: 'warehouse', header: 'Destination', cell: info => store.warehouses.find(w => w.id === info.getValue())?.name },
                { accessorKey: 'items', header: 'Lines', cell: info => info.getValue()?.length || 0 },
                { accessorKey: 'status', header: 'Status', cell: info => <Badge status={info.getValue()} /> }
            );
        } else if (type === 'deliveries') {
            baseCols.push(
                { accessorKey: 'reference', header: 'Order Ref', cell: info => <span className="font-orbitron text-accent-yellow">{info.getValue()}</span> },
                { accessorKey: 'customer', header: 'Customer' },
                { accessorKey: 'warehouse', header: 'Origin', cell: info => store.warehouses.find(w => w.id === info.getValue())?.name },
                { accessorKey: 'items', header: 'Lines', cell: info => info.getValue()?.length || 0 },
                { accessorKey: 'status', header: 'Status', cell: info => <Badge status={info.getValue()} /> }
            );
        } else {
            // Transfers & Adjustments (Transactions format)
            baseCols.push(
                { accessorKey: 'reference', header: 'Reference', cell: info => <span className="font-orbitron text-accent-yellow">{info.getValue()}</span> },
                { accessorKey: 'productId', header: 'Product', cell: info => store.products.find(p => p.id === info.getValue())?.name },
                {
                    accessorKey: 'qtyChange', header: 'Qty Change', cell: info => {
                        const val = info.getValue();
                        return <span className={`font-orbitron font-bold ${val > 0 ? 'text-success' : val < 0 ? 'text-danger' : 'text-text-secondary'}`}>{val > 0 ? `+${val}` : val}</span>
                    }
                },
                { accessorKey: 'user', header: 'Operator' }
            );
        }

        // Actions
        baseCols.push({
            id: 'actions',
            header: 'Actions',
            cell: () => (
                <div className="flex items-center gap-2">
                    <button className="p-1.5 text-text-secondary hover:text-white bg-elevated rounded transition-colors tooltip-trigger">
                        <Eye size={14} />
                    </button>
                    <button className="p-1.5 text-text-secondary hover:text-accent-yellow bg-elevated rounded transition-colors tooltip-trigger">
                        <FileCheck2 size={14} />
                    </button>
                </div>
            )
        });

        return baseCols;
    }, [type, store]);

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-elevated border border-border flex items-center justify-center">
                        {config.icon}
                    </div>
                    <div>
                        <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">{config.title}</h2>
                        <p className="text-text-secondary">{config.desc}</p>
                    </div>
                </div>

                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} className="mr-2" /> {config.actionText}
                </Button>
            </div>

            <Card className="mb-6 py-3 px-4 flex items-center gap-4">
                <div className="w-full max-w-md">
                    <Input
                        leftIcon={<Search size={16} />}
                        placeholder={`Search ${type}...`}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="ghost" className="border-border ml-auto">
                    <Filter size={16} className="mr-2" /> Filters
                </Button>
            </Card>

            <Table
                data={data}
                columns={columns}
                pageSize={15}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={config.actionText}>
                <div className="flex flex-col items-center justify-center py-12 text-center text-text-secondary">
                    <SlidersHorizontal size={48} className="mb-4 opacity-20" />
                    <p>Workflow form for {config.actionText} goes here.</p>
                    <p className="text-xs mt-2">In a full application, this would contain a multi-step form for line items.</p>
                </div>
            </Modal>

        </PageWrapper>
    );
};
