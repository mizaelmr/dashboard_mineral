"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

interface Processo {
  key: string;
  id: string;
  nome: string;
  numero: string;
  hectares: string;
  observacao: string;
}

const ProcessosPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Dados de exemplo
  const [dataSource, setDataSource] = useState<Processo[]>([
    {
      key: "1",
      id: "1",
      nome: "871.860/2006",
      numero: "871.860/2006",
      hectares: "894,00",
      observacao: "Não informado",
    },
    {
      key: "2",
      id: "2",
      nome: "871.861/2006",
      numero: "871.861/2006",
      hectares: "923,25",
      observacao: "Não informado",
    },
    {
      key: "3",
      id: "3",
      nome: "873.335/2006",
      numero: "873.335/2006",
      hectares: "871,51",
      observacao: "Não informado",
    },
  ]);

  const columns: TableColumn<Processo>[] = [
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
    },
    {
      title: "Número",
      dataIndex: "numero",
      key: "numero",
      width: 200,
      sorter: (a, b) => a.numero.localeCompare(b.numero),
    },
    {
      title: "Hectares",
      dataIndex: "hectares",
      key: "hectares",
      width: 150,
      sorter: (a, b) => {
        const aValue = parseFloat(a.hectares.replace(",", "."));
        const bValue = parseFloat(b.hectares.replace(",", "."));
        return aValue - bValue;
      },
    },
    {
      title: "Observação",
      dataIndex: "observacao",
      key: "observacao",
      width: 200,
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

  const handleView = (record: Processo) => {
    router.push(`/processos/view/${record.id}`);
  };

  const handleEdit = (record: Processo) => {
    router.push(`/processos/edit/${record.id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Excluir processo:", id);
    // Implementar lógica de exclusão
    setDataSource(dataSource.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    router.push("/processos/addprocessos");
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    // Implementar lógica de busca
  };

  // Filtrar dados baseado na busca
  const filteredData = dataSource.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

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
          Processos
        </h1>
        <Space>
          <Input
            placeholder="Buscar processos..."
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
            Novo Processo
          </Button>
        </Space>
      </div>

      <Table<Processo>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} processos`,
        }}
        scroll={{ x: 1000 }}
        bordered
      />
    </div>
  );
};

export default ProcessosPage;
