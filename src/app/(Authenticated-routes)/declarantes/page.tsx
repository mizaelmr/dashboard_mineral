"use client";

import React, { useState } from "react";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Declarante {
  key: string;
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  tipo: "físico" | "jurídico";
  status: "ativo" | "inativo";
}

const DeclarantesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Dados de exemplo
  const [dataSource, setDataSource] = useState<Declarante[]>([
    {
      key: "1",
      id: "1",
      nome: "Carlos Mendes",
      cpf: "123.456.789-00",
      email: "carlos.mendes@email.com",
      telefone: "(71) 99999-9999",
      cidade: "Salvador",
      estado: "BA",
      tipo: "físico",
      status: "ativo",
    },
    {
      key: "2",
      id: "2",
      nome: "Fernanda Lima",
      cpf: "987.654.321-00",
      email: "fernanda.lima@email.com",
      telefone: "(71) 88888-8888",
      cidade: "Feira de Santana",
      estado: "BA",
      tipo: "físico",
      status: "ativo",
    },
    {
      key: "3",
      id: "3",
      nome: "Mineração Bahia S.A.",
      cpf: "12.345.678/0001-90",
      email: "contato@mineracaobahia.com.br",
      telefone: "(71) 77777-7777",
      cidade: "Vitória da Conquista",
      estado: "BA",
      tipo: "jurídico",
      status: "ativo",
    },
    {
      key: "4",
      id: "4",
      nome: "Roberto Alves",
      cpf: "111.222.333-44",
      email: "roberto.alves@email.com",
      telefone: "(71) 66666-6666",
      cidade: "Ilhéus",
      estado: "BA",
      tipo: "físico",
      status: "inativo",
    },
    {
      key: "5",
      id: "5",
      nome: "Juliana Rocha",
      cpf: "555.666.777-88",
      email: "juliana.rocha@email.com",
      telefone: "(71) 55555-5555",
      cidade: "Juazeiro",
      estado: "BA",
      tipo: "físico",
      status: "ativo",
    },
    {
      key: "6",
      id: "6",
      nome: "Extração Mineral LTDA",
      cpf: "98.765.432/0001-10",
      email: "contato@extracaomineral.com.br",
      telefone: "(71) 44444-4444",
      cidade: "Camaçari",
      estado: "BA",
      tipo: "jurídico",
      status: "ativo",
    },
  ]);

  const columns: TableColumn<Declarante>[] = [
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
      dataIndex: "cpf",
      key: "cpf",
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
      title: "Telefone",
      dataIndex: "telefone",
      key: "telefone",
      width: 150,
    },
    {
      title: "Cidade",
      dataIndex: "cidade",
      key: "cidade",
      width: 150,
      sorter: (a, b) => a.cidade.localeCompare(b.cidade),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: 100,
      filters: [
        { text: "BA", value: "BA" },
        { text: "SP", value: "SP" },
        { text: "RJ", value: "RJ" },
      ],
      onFilter: (value, record) => record.estado === value,
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      width: 120,
      filters: [
        { text: "Físico", value: "físico" },
        { text: "Jurídico", value: "jurídico" },
      ],
      onFilter: (value, record) => record.tipo === value,
      render: (tipo: string) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: tipo === "físico" ? "#e6f7ff" : "#f0f5ff",
            color: tipo === "físico" ? "#1890ff" : "#2f54eb",
            fontWeight: 500,
          }}
        >
          {tipo === "físico" ? "Físico" : "Jurídico"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      filters: [
        { text: "Ativo", value: "ativo" },
        { text: "Inativo", value: "inativo" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: status === "ativo" ? "#f6ffed" : "#fff2e8",
            color: status === "ativo" ? "#52c41a" : "#fa8c16",
            fontWeight: 500,
          }}
        >
          {status === "ativo" ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      title: "Ações",
      key: "acoes",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
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

  const handleEdit = (record: Declarante) => {
    console.log("Editar declarante:", record);
    // Implementar lógica de edição
  };

  const handleDelete = (id: string) => {
    console.log("Excluir declarante:", id);
    // Implementar lógica de exclusão
    setDataSource(dataSource.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    console.log("Adicionar novo declarante");
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
          Declarantes
        </h1>
        <Space>
          <Input
            placeholder="Buscar declarantes..."
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
            Novo Declarante
          </Button>
        </Space>
      </div>

      <Table<Declarante>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} declarantes`,
        }}
        scroll={{ x: 1200 }}
        bordered
      />
    </div>
  );
};

export default DeclarantesPage;
