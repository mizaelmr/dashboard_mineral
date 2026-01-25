"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

interface Cliente {
  key: string;
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  status: "ativo" | "inativo";
}

const ClientesPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Dados de exemplo
  const [dataSource, setDataSource] = useState<Cliente[]>([
    {
      key: "1",
      id: "1",
      nome: "João Silva",
      cpfCnpj: "123.456.789-00",
      email: "joao.silva@email.com",
      telefone: "(71) 99999-9999",
      cidade: "Salvador",
      estado: "BA",
      status: "ativo",
    },
    {
      key: "2",
      id: "2",
      nome: "Maria Santos",
      cpfCnpj: "987.654.321-00",
      email: "maria.santos@email.com",
      telefone: "(71) 88888-8888",
      cidade: "Feira de Santana",
      estado: "BA",
      status: "ativo",
    },
    {
      key: "3",
      id: "3",
      nome: "Empresa Mineração LTDA",
      cpfCnpj: "12.345.678/0001-90",
      email: "contato@mineracao.com.br",
      telefone: "(71) 77777-7777",
      cidade: "Vitória da Conquista",
      estado: "BA",
      status: "ativo",
    },
    {
      key: "4",
      id: "4",
      nome: "Pedro Oliveira",
      cpfCnpj: "111.222.333-44",
      email: "pedro.oliveira@email.com",
      telefone: "(71) 66666-6666",
      cidade: "Ilhéus",
      estado: "BA",
      status: "inativo",
    },
    {
      key: "5",
      id: "5",
      nome: "Ana Costa",
      cpfCnpj: "555.666.777-88",
      email: "ana.costa@email.com",
      telefone: "(71) 55555-5555",
      cidade: "Juazeiro",
      estado: "BA",
      status: "ativo",
    },
  ]);

  const columns: TableColumn<Cliente>[] = [
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

  const handleView = (record: Cliente) => {
    router.push(`/clientes/view/${record.id}`);
  };

  const handleEdit = (record: Cliente) => {
    router.push(`/clientes/edit/${record.id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Excluir cliente:", id);
    // Implementar lógica de exclusão
    setDataSource(dataSource.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    router.push("/clientes/addclientes");
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

      <Table<Cliente>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} clientes`,
        }}
        scroll={{ x: 1200 }}
        bordered
      />
    </div>
  );
};

export default ClientesPage;
