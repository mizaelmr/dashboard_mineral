"use client";

import React from "react";
import { Table as AntTable } from "antd";
import type { TableProps as AntTableProps } from "antd";

export interface TableColumn<T = any> {
  title: string;
  dataIndex?: string | string[];
  key?: string;
  width?: string | number;
  align?: "left" | "right" | "center";
  sorter?: boolean | ((a: T, b: T) => number);
  render?: (value: any, record: T, index: number) => React.ReactNode;
  filters?: Array<{ text: string; value: any }>;
  onFilter?: (value: any, record: T) => boolean;
  fixed?: boolean | "left" | "right";
  ellipsis?: boolean | { showTitle?: boolean };
  responsive?: Array<"xs" | "sm" | "md" | "lg" | "xl" | "xxl">;
  hidden?: boolean;
}

export interface TableProps<T = any> extends Omit<AntTableProps<T>, "columns"> {
  columns: TableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  pagination?: AntTableProps<T>["pagination"] | false;
  rowKey?: string | ((record: T) => string);
  size?: "small" | "middle" | "large";
  bordered?: boolean;
  scroll?: { x?: number | string; y?: number | string };
  onRow?: (record: T, index?: number) => {
    onClick?: (event: React.MouseEvent) => void;
    onDoubleClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
  };
}

function Table<T extends Record<string, any> = any>({
  columns,
  dataSource,
  loading = false,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} itens`,
  },
  rowKey = "key",
  size = "middle",
  bordered = false,
  scroll,
  onRow,
  ...rest
}: TableProps<T>) {
  // Filtrar colunas ocultas antes de passar para o AntTable
  const visibleColumns = columns.filter((column) => !column.hidden);

  return (
    <AntTable<T>
      columns={visibleColumns}
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      rowKey={rowKey}
      size={size}
      bordered={bordered}
      scroll={scroll}
      onRow={onRow}
      {...rest}
    />
  );
}

export default Table;
