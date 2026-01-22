"use client";

import React, { useState } from "react";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

interface Substancia {
  key: string;
  id: string;
  nome: string;
}

const SubstânciasPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Dados de exemplo
  const [dataSource, setDataSource] = useState<Substancia[]>([
    {
      key: "1",
      id: "1",
      nome: "ESMERALDA",
    },
    {
      key: "2",
      id: "2",
      nome: "ALEXANDRITA",
    },
    {
      key: "3",
      id: "3",
      nome: "MOLIBDENIO",
    },
    {
      key: "4",
      id: "4",
      nome: "QUARTZO",
    },
  ]);

  const columns: TableColumn<Substancia>[] = [
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
      sorter: (a, b) => a.nome.localeCompare(b.nome),
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

  const handleView = (record: Substancia) => {
    console.log("Visualizar substância:", record);
    // Implementar lógica de visualização
  };

  const handleEdit = (record: Substancia) => {
    console.log("Editar substância:", record);
    // Implementar lógica de edição
  };

  const handleDelete = (id: string) => {
    console.log("Excluir substância:", id);
    // Implementar lógica de exclusão
    setDataSource(dataSource.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    console.log("Adicionar nova substância");
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
          Substâncias
        </h1>
        <Space>
          <Input
            placeholder="Buscar substâncias..."
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
            Nova Substância
          </Button>
        </Space>
      </div>

      <Table<Substancia>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} substâncias`,
        }}
        scroll={{ x: 800 }}
        bordered
      />
    </div>
  );
};

export default SubstânciasPage;
