import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const Table = ({
    data,
    columns,
    pageSize = 10,
    onRowClick
}) => {
    const [sorting, setSorting] = useState([]);
    const setHover = useUIStore(s => s.setCursorHoverState);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
    });

    return (
        <div className="flex flex-col w-full">
            <div className="overflow-x-auto border border-border bg-surface rounded-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-elevated border-b border-border text-text-secondary font-orbitron group">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={`px-4 py-3 font-medium select-none ${header.column.getCanSort() ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
                                        onMouseEnter={() => header.column.getCanSort() && setHover('link')}
                                        onMouseLeave={() => header.column.getCanSort() && setHover('default')}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: <ChevronUp size={14} className="text-accent-yellow" />,
                                                desc: <ChevronDown size={14} className="text-accent-yellow" />
                                            }[header.column.getIsSorted()] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <motion.tbody
                        initial="initial"
                        animate="animate"
                        variants={{ animate: { transition: { staggerChildren: 0.03 } } }}
                    >
                        {table.getRowModel().rows.map(row => (
                            <motion.tr
                                key={row.id}
                                variants={{
                                    initial: { opacity: 0, y: 10 },
                                    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } }
                                }}
                                onClick={() => onRowClick && onRowClick(row.original)}
                                onMouseEnter={() => {
                                    if (onRowClick) setHover('table-row');
                                }}
                                onMouseLeave={() => {
                                    if (onRowClick) setHover('default');
                                }}
                                className={`border-b border-border/50 transition-colors 
                  ${onRowClick ? 'cursor-pointer hover:bg-elevated/70' : 'hover:bg-elevated/30'} 
                  hover:border-l-2 hover:border-l-accent-yellow border-l-2 border-l-transparent`}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-3 text-white">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}

                        {table.getRowModel().rows.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-text-secondary">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                    <span className="text-sm text-text-secondary">
                        Page <span className="text-white font-medium">{table.getState().pagination.pageIndex + 1}</span> of{' '}
                        <span className="text-white font-medium">{table.getPageCount()}</span>
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            onMouseEnter={() => table.getCanPreviousPage() && setHover('button')}
                            onMouseLeave={() => setHover('default')}
                            className="p-1 rounded bg-elevated border border-border text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent-yellow hover:text-accent-yellow transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            onMouseEnter={() => table.getCanNextPage() && setHover('button')}
                            onMouseLeave={() => setHover('default')}
                            className="p-1 rounded bg-elevated border border-border text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent-yellow hover:text-accent-yellow transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
