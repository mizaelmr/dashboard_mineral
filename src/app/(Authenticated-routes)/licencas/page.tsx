"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

interface Licenca {
  key: string;
  id: string;
  nome: string;
  cadastrado: string;
}

const LicencasPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Dados de exemplo
  const [dataSource, setDataSource] = useState<Licenca[]>([
    {
      key: "1",
      id: "1",
      nome: "INEMA 499 D.O.E 01/07/2011",
      cadastrado: "15/01/2024",
    },
    {
      key: "2",
      id: "2",
      nome: "INEMA 500 D.O.E 15/08/2012",
      cadastrado: "20/02/2024",
    },
    {
      key: "3",
      id: "3",
      nome: "INEMA 501 D.O.E 20/09/2013",
      cadastrado: "10/06/2023",
    },
    {
      key: "4",
      id: "4",
      nome: "INEMA 502 D.O.E 05/10/2014",
      cadastrado: "05/03/2024",
    },
    {
      key: "5",
      id: "5",
      nome: "INEMA 503 D.O.E 12/11/2015",
      cadastrado: "12/04/2024",
    },
    {
      key: "6",
      id: "6",
      nome: "INEMA 504 D.O.E 18/12/2016",
      cadastrado: "18/05/2024",
    },
  ]);

  const columns: TableColumn<Licenca>[] = [
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
      title: "Cadastrado",
      dataIndex: "cadastrado",
      key: "cadastrado",
      width: 100,
      sorter: (a, b) => {
        const dateA = new Date(a.cadastrado.split("/").reverse().join("-"));
        const dateB = new Date(b.cadastrado.split("/").reverse().join("-"));
        return dateA.getTime() - dateB.getTime();
      },
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
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
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

  const handleView = (record: Licenca) => {
    console.log("Visualizar licença:", record);
    // Implementar lógica de visualização
  };

  const handleDelete = (id: string) => {
    console.log("Excluir licença:", id);
    // Implementar lógica de exclusão
    setDataSource(dataSource.filter((item) => item.id !== id));
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    // Implementar lógica de busca
  };

  const handleAddLicense = () => {
    router.push("/licencas/addlicencas");
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
          Licenças
        </h1>
        <Space>
          <Input
            placeholder="Buscar licenças..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddLicense}
          >
            Nova Licença
          </Button>
        </Space>
      </div>

      <Table<Licenca>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} licenças`,
        }}
        scroll={{ x: 800 }}
        bordered
      />
    </div>
  );
};

export default LicencasPage;
