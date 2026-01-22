"use client";

import React, { useState } from "react";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

interface Mineradora {
  key: string;
  id: string;
  nome: string;
  processo: string;
  concessao: string;
  observacao: string;
}

const MineradorasPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Dados de exemplo
  const [dataSource, setDataSource] = useState<Mineradora[]>([
    {
      key: "2",
      id: "2",
      nome: "MINAS DIVERSAS (871.861/2006)",
      processo: "871.861/2006",
      concessao: "",
      observacao: "ATIVA",
    },
    {
      key: "3",
      id: "3",
      nome: "MINAS DIVERSAS (871.860/2006)",
      processo: "871.860/2006",
      concessao: "",
      observacao: "ATIVA",
    },
    {
      key: "4",
      id: "4",
      nome: "MINAS DIVERSAS (873.335/2006)",
      processo: "873.335/2006",
      concessao: "",
      observacao: "ATIVA",
    },
  ]);

  const columns: TableColumn<Mineradora>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id.localeCompare(b.id),
      hidden: true,
    },
    {
      title: "#",
      dataIndex: "id",
      key: "numero",
      width: 80,
      hidden: true,
      sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      width: 300,
      sorter: (a, b) => a.nome.localeCompare(b.nome),
    },
    {
      title: "Processo",
      dataIndex: "processo",
      key: "processo",
      width: 150,
      sorter: (a, b) => a.processo.localeCompare(b.processo),
    },
    {
      title: "Concessão",
      dataIndex: "concessao",
      key: "concessao",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "Observação",
      dataIndex: "observacao",
      key: "observacao",
      width: 120,
      render: (observacao: string) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: observacao === "ATIVA" ? "#f6ffed" : "#fff2e8",
            color: observacao === "ATIVA" ? "#52c41a" : "#fa8c16",
            fontWeight: 500,
          }}
        >
          {observacao}
        </span>
      ),
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

  const handleView = (record: Mineradora) => {
    console.log("Visualizar mineradora:", record);
    // Implementar lógica de visualização
  };

  const handleEdit = (record: Mineradora) => {
    console.log("Editar mineradora:", record);
    // Implementar lógica de edição
  };

  const handleDelete = (id: string) => {
    console.log("Excluir mineradora:", id);
    // Implementar lógica de exclusão
    setDataSource(dataSource.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    console.log("Adicionar nova mineradora");
    // Implementar lógica de adição
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
          Mineradoras
        </h1>
        <Space>
          <Input
            placeholder="Buscar mineradoras..."
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
            Nova Mineradora
          </Button>
        </Space>
      </div>

      <Table<Mineradora>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} mineradoras`,
        }}
        scroll={{ x: 1000 }}
        bordered
      />
    </div>
  );
};

export default MineradorasPage;
