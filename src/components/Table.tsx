import React, { useMemo, useState } from "react";
import type { FragranceData } from '../types/FragranceTypes';

type SortConfig = {
    key: string;
    direction: 'asc' | 'desc';
} | null;

type TableProps = {
    data: FragranceData[];
    headers: string[];
};

const Table: React.FC<TableProps> = ({ data, headers }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    // Group data by formula_id
    const groupedData = useMemo(() => {
        const groups = new Map<string, FragranceData[]>();
        
        data.forEach(item => {
            const id = item.formula_id;
            if (!groups.has(id)) {
                groups.set(id, []);
            }
            groups.get(id)!.push(item);
        });

        return Array.from(groups.entries()).map(([formula_id, items]) => ({
            formula_id,
            items,
            count: items.length,
            // Use first item's data for display in the aggregated row
            representativeData: items[0]
        }));
    }, [data]);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig) return groupedData;

        const sorted = [...groupedData].sort((a, b) => {
            const aValue = a.representativeData[sortConfig.key as keyof FragranceData];
            const bValue = b.representativeData[sortConfig.key as keyof FragranceData];

            // Try to parse as numbers for numeric sorting
            const aNum = parseFloat(String(aValue));
            const bNum = parseFloat(String(bValue));

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
            }

            // Otherwise sort as strings
            const aStr = String(aValue);
            const bStr = String(bValue);
            
            if (aStr < bStr) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aStr > bStr) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    }, [groupedData, sortConfig]);

    const formatHeader = (header: string) => {
        return header
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    const toggleRow = (formula_id: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(formula_id)) {
                newSet.delete(formula_id);
            } else {
                newSet.add(formula_id);
            }
            return newSet;
        });
    };

    if (data.length === 0) {
        return <div>Loading...</div>;
    }

    return (
    <div>
        <table className="w-full min-w-max">
            <thead className="bg-zinc-700 text-white border-b border-zinc-300 sticky top-0">
                <tr>
                    <th className="px-3 py-2 w-10 text-sm">
                        <span className="sr-only">Expand/Collapse</span>
                    </th>
                    {headers.map(header => (
                        <th 
                            key={header}
                            onClick={() => handleSort(header)}
                            className="cursor-pointer px-4 py-2 hover:bg-zinc-600"
                        >
                            {formatHeader(header)}
                            {sortConfig?.key === header && (
                                <span className="ml-1 p-2">
                                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                                </span>
                            )}
                        </th>
                    ))}
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map((group) => (
                    <React.Fragment key={group.formula_id}>
                        <tr 
                            onClick={() => toggleRow(group.formula_id)}
                            className={`cursor-pointer ${
                                expandedRows.has(group.formula_id) 
                                    ? 'bg-gray-200' 
                                    : 'even:bg-gray-50 odd:bg-white hover:bg-gray-100'
                            }`}
                        >
                            <td className="px-4 py-2 hover:bg-gray-200">
                                {expandedRows.has(group.formula_id) ? '▼' : '▶'}
                            </td>
                            {headers.map(header => (
                                <td key={header} className="px-4 py-2">
                                    {group.representativeData[header as keyof FragranceData]}
                                </td>
                            ))}
                            <td className="px-4 py-2">
                                <strong>{group.count}</strong>
                            </td>
                        </tr>
                        
                        {/* Expanded detail rows */}
                        {expandedRows.has(group.formula_id) && group.items.map((item, idx) => (
                            <tr 
                                key={`${group.formula_id}-${idx}`}
                                className="bg-zinc-300 even:bg-zinc-100"
                            >
                                <td></td>
                                {headers.map(header => (
                                    <td key={header} >
                                        {item[header as keyof FragranceData]}
                                    </td>
                                ))}
                                <td className="px-4 py-2"></td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    </div>
    );
};

export default Table;