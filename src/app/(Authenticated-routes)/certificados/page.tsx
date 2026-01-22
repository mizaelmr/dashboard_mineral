"use client";

import React, { useState } from "react";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

interface Certificado {
  key: string;
  id: string;
  cliente: string;
  descricao: string;
  dataGerada: string;
  valor: string;
}

const CertificadosPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Dados de exemplo
  const [dataSource, setDataSource] = useState<Certificado[]>([
    {
      key: "1",
      id: "3186",
      cliente: "TIME INVEST ADMINISTRAÇÃO E PARTICIPAÇÕES EIRELI-ME",
      descricao: "CANGA DE ESMERALDA",
      dataGerada: "2026-01-21 15:48:37",
      valor: "R$ 6.000,00",
    },
    {
      key: "2",
      id: "3185",
      cliente: "YUSO ANTÔNIO VIEIRA COSTA",
      descricao: "ESMERALDA BRUTA",
      dataGerada: "2026-01-15 14:05:11",
      valor: "R$ 1.260,00",
    },
    {
      key: "3",
      id: "3184",
      cliente: "RICARDO NAZARENO CAMPELO SIQUEIRA",
      descricao: "ESMERALDA BRUTA",
      dataGerada: "2026-01-14 14:31:35",
      valor: "R$ 1.000,00",
    },
    {
      key: "4",
      id: "3183",
      cliente: "LEONARDO DA SILVA GOMES",
      descricao: "ESMERALDA BRUTA",
      dataGerada: "2026-01-14 14:07:51",
      valor: "R$ 496,00",
    },
  ]);

  const columns: TableColumn<Certificado>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
      hidden: true,
    },
    {
      title: "#ID",
      dataIndex: "id",
      key: "numero",
      width: 100,
      sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
      width: 300,
      ellipsis: true,
      sorter: (a, b) => a.cliente.localeCompare(b.cliente),
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      width: 200,
      sorter: (a, b) => a.descricao.localeCompare(b.descricao),
    },
    {
      title: "Data gerada",
      dataIndex: "dataGerada",
      key: "dataGerada",
      width: 180,
      sorter: (a, b) => {
        const dateA = new Date(a.dataGerada.replace(" ", "T"));
        const dateB = new Date(b.dataGerada.replace(" ", "T"));
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      width: 150,
      align: "right",
      sorter: (a, b) => {
        const aValue = parseFloat(a.valor.replace("R$ ", "").replace(".", "").replace(",", "."));
        const bValue = parseFloat(b.valor.replace("R$ ", "").replace(".", "").replace(",", "."));
        return aValue - bValue;
      },
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

  const handleView = (record: Certificado) => {
    console.log("Visualizar certificado:", record);
    // Implementar lógica de visualização
  };

  const handleEdit = (record: Certificado) => {
    console.log("Editar certificado:", record);
    // Implementar lógica de edição
  };

  const handleDelete = (id: string) => {
    console.log("Excluir certificado:", id);
    // Implementar lógica de exclusão
    setDataSource(dataSource.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    console.log("Adicionar novo certificado");
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
          Certificados
        </h1>
        <Space>
          <Input
            placeholder="Buscar certificados..."
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
            Novo Certificado
          </Button>
        </Space>
      </div>

      <Table<Certificado>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} certificados`,
        }}
        scroll={{ x: 1200 }}
        bordered
      />
    </div>
  );
};

export default CertificadosPage;
