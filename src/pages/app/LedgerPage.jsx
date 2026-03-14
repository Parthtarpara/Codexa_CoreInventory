import { useState, useMemo } from 'react';
import { FileText, Download, Filter, Search, ShieldCheck } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useSearch } from '../../hooks/useSearch';
import { formatDateTime } from '../../utils/formatters';

export const LedgerPage = () => {
    const { transactions, products } = useInventoryStore();
    const [searchTerm, setSearchTerm, debouncedTerm] = useSearch('', 300);

    const [typeFilter, setTypeFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');

    // Extract unique users for filter
    const uniqueUsers = useMemo(() => {
        return [...new Set(transactions.map(t => t.user))];
    }, [transactions]);

    const filteredData = useMemo(() => {
        return transactions.filter(t => {
            const p = products.find(prod => prod.id === t.productId);
            const searchStr = `${t.id} ${t.reference} ${t.productId} ${p?.name || ''}`.toLowerCase();

            const matchSearch = searchStr.includes(debouncedTerm.toLowerCase());
            const matchType = typeFilter ? t.type === typeFilter : true;
            const matchUser = userFilter ? t.user === userFilter : true;

            return matchSearch && matchType && matchUser;
        });
    }, [transactions, products, debouncedTerm, typeFilter, userFilter]);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Entry ID',
            cell: info => <span className="text-text-secondary text-xs">{info.getValue()}</span>
        },
        {
            accessorKey: 'date',
            header: 'Timestamp',
            cell: info => <span className="font-orbitron font-medium">{formatDateTime(info.getValue())}</span>
        },
        {
            accessorKey: 'type',
            header: 'Operation',
            cell: info => {
                const val = info.getValue();
                const color = val === 'Receipt' ? 'text-success' : val === 'Delivery' ? 'text-danger' : val === 'Transfer' ? 'text-warning' : 'text-accent-yellow';
                return <span className={color}>{val}</span>;
            }
        },
        {
            accessorKey: 'productId',
            header: 'Product',
            cell: info => {
                const p = products.find(prod => prod.id === info.getValue());
                return <span className="text-white">{p?.name || info.getValue()}</span>;
            }
        },
        {
            accessorKey: 'qtyChange',
            header: 'Delta',
            cell: info => {
                const val = info.getValue();
                return <span className={`font-orbitron font-bold ${val > 0 ? 'text-success' : val < 0 ? 'text-danger' : 'text-white'}`}>
                    {val > 0 ? `+${val}` : val}
                </span>;
            }
        },
        {
            accessorKey: 'reference',
            header: 'Reference',
            cell: info => <span className="text-text-secondary">{info.getValue()}</span>
        },
        {
            accessorKey: 'user',
            header: 'Operator',
            cell: info => <span className="text-white bg-elevated px-2 py-0.5 rounded text-xs">{info.getValue()}</span>
        }
    ], [products]);

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide flex items-center">
                        <ShieldCheck size={24} className="mr-3 text-accent-yellow" /> Immutable Ledger
                    </h2>
                    <p className="text-text-secondary mt-1">Audit trail of every single inventory movement in the system.</p>
                </div>

                <Button variant="ghost" className="border-border hover:border-accent-yellow text-accent-yellow">
                    <Download size={16} className="mr-2" /> Export CSV
                </Button>
            </div>

            <Card className="mb-6 py-3 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <Input
                    label="Search Ledger"
                    leftIcon={<Search size={16} />}
                    placeholder="Tx ID, Ref, or Product..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <Select
                    label="Operation Type"
                    options={[
                        { value: '', label: 'All Operations' },
                        { value: 'Receipt', label: 'Receipts (+)' },
                        { value: 'Delivery', label: 'Deliveries (-)' },
                        { value: 'Transfer', label: 'Transfers' },
                        { value: 'Adjustment', label: 'Adjustments' }
                    ]}
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                />

                <Select
                    label="Operator"
                    options={[
                        { value: '', label: 'All Operators' },
                        ...uniqueUsers.map(u => ({ value: u, label: u }))
                    ]}
                    value={userFilter}
                    onChange={e => setUserFilter(e.target.value)}
                />

                <Button variant="ghost" className="border-border w-full">
                    <Filter size={16} className="mr-2" /> More Filters
                </Button>
            </Card>

            <Table
                data={filteredData}
                columns={columns}
                pageSize={20}
            />
        </PageWrapper>
    );
};
