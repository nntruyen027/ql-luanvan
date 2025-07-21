'use client';

import { Table } from 'antd';
import type { ColumnType, TableProps } from 'antd/es/table';
import React, { useMemo, useState } from 'react';

export type PageData<T> = {
    content: T[];
    totalElements: number;
    page: number;
    size: number;
};

export type DynamicColumn<T> = ColumnType<T>;

type DynamicTableProps<T> = {
    columns: DynamicColumn<T>[];
    data: PageData<T>;
    rowKey: string;
    onChange?: (pagination: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    actions?: (record: T) => React.ReactNode;
    onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    loading?: boolean;
};

export default function DynamicTable<T extends object>({
    columns,
    data,
    rowKey,
    onChange,
    actions,
    onSelectionChange,
    loading = false,
}: DynamicTableProps<T>) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const internalColumns = useMemo(() => {
        const baseCols = [...columns];
        if (actions) {
            baseCols.push({
                title: 'Thao tác',
                key: 'actions',
                render: (_: any, record: T) => actions(record),
                fixed: 'right',
            });
        }
        return baseCols;
    }, [columns, actions]);

    const handleChange: TableProps<T>['onChange'] = (pagination, _filters, sorter) => {
        if (!onChange) return;
        const isSorter = !Array.isArray(sorter) && sorter.field;
        onChange({
            page: pagination.current || 1,
            size: pagination.pageSize || 10,
            sortField: isSorter ? String(sorter.field) : undefined,
            sortOrder: isSorter ? (sorter.order === 'ascend' ? 'asc' : 'desc') : undefined,
        });
    };

    const rowSelection: TableProps<T>['rowSelection'] = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys, selectedRows) => {
            setSelectedRowKeys(newSelectedRowKeys);
            onSelectionChange?.(newSelectedRowKeys, selectedRows);
        },
    };

    return (
        <Table
            rowKey={rowKey}
            columns={internalColumns}
            dataSource={data.content}
            loading={loading}
            pagination={{
                current: data.page,
                pageSize: data.size,
                total: data.totalElements,
                showSizeChanger: true,
                showTotal: (total) => `Tổng cộng ${total} mục`,
            }}
            onChange={handleChange}
            scroll={{ x: 'max-content' }}
            rowSelection={rowSelection}
        />
    );
}
