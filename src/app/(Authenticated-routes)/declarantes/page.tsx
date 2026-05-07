"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input, message } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getClientsByType, deleteClient } from "../clientes/actions";
import { ClienteTableRow, mapClientToTableRow } from "@/types/client";
import { formatPhone } from "@/utils/formatPhone";
import { capitalizeWords } from "@/utils/capitalize";

const DeclarantesPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<ClienteTableRow[]>([]);

  const loadDeclarantes = useCallback(async () => {
    setLoading(true);
    try {
      const clients = await getClientsByType(2);
      setDataSource(clients.map(mapClientToTableRow));
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao carregar declarantes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeclarantes();
  }, [loadDeclarantes]);

  const handleView = (record: ClienteTableRow) => {
    router.push(`/declarantes/view/${record.id}`);
  };

  const handleEdit = (record: ClienteTableRow) => {
    router.push(`/declarantes/edit/${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClient(Number(id));
      message.success("Declarante excluído com sucesso.");
      await loadDeclarantes();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao excluir declarante."
      );
    }
  };

  const handleAdd = () => {
    router.push("/declarantes/adddeclarantes");
  };

  const filteredData = dataSource.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

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
      render: (text) => <strong>{capitalizeWords(text)}</strong>,
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
          Declarantes
        </h1>
        <Space>
          <Input
            placeholder="Buscar declarantes..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Novo Declarante
          </Button>
        </Space>
      </div>

      <Table<ClienteTableRow>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} declarantes`,
        }}
        scroll={{ x: 800 }}
        bordered
      />
    </div>
  );
};

export default DeclarantesPage;
