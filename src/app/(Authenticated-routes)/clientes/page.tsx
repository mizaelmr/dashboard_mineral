"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { getAllClients, searchClients, deleteClient } from "./actions";
import { ClienteTableRow, mapClientToTableRow } from "@/types/client";
import { formatPhone } from "@/utils/formatPhone";

const ClientesPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ClienteTableRow[]>([]);

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const clients = await getAllClients();
      const mappedClients = clients.map(mapClientToTableRow);
      setDataSource(mappedClients);
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to load clients"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleView = (record: ClienteTableRow) => {
    router.push(`/clientes/view/${record.id}`);
  };

  const handleEdit = (record: ClienteTableRow) => {
    router.push(`/clientes/edit/${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClient(Number(id));
      message.success("Client deleted successfully");
      await loadClients();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to delete client"
      );
    }
  };

  const columns: TableColumn<ClienteTableRow>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id.localeCompare(b.id),
      hidden: true,
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      width: 200,
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "CPF/CNPJ",
      dataIndex: "cpfCnpj",
      key: "cpfCnpj",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
      width: 130,
      render: (text: string) => formatPhone(text),
    },
    {
      title: "Ações",
      key: "acoes",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />

        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    router.push("/clientes/addclientes");
  };

  const performSearch = useCallback(async (value: string) => {
    setLoading(true);
    try {
      if (value.trim()) {
        const clients = await searchClients({ name: value.trim() });
        const mappedClients = clients.map(mapClientToTableRow);
        setDataSource(mappedClients);
      } else {
        await loadClients();
      }
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to search clients"
      );
    } finally {
      setLoading(false);
    }
  }, [loadClients]);

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 500),
    [performSearch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
          Clientes
        </h1>
        <Space>
          <Input
            placeholder="Buscar clientes..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Novo Cliente
          </Button>
        </Space>
      </div>

      <Table<ClienteTableRow>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} clientes`,
        }}
        scroll={{ x: 1180 }}
        bordered
      />
    </div>
  );
};

export default ClientesPage;
