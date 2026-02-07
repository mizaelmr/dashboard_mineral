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
import {
  getAllLicenses,
  deleteLicense,
} from "./actions";
import {
  LicenseTableRow,
  mapLicenseToTableRow,
} from "@/types/license";
import { capitalizeWords } from "@/utils/capitalize";

const LicencasPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<LicenseTableRow[]>([]);

  const loadLicenses = useCallback(async () => {
    setLoading(true);
    try {
      const licenses = await getAllLicenses();
      setDataSource(licenses.map(mapLicenseToTableRow));
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao carregar licenças."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLicenses();
  }, [loadLicenses]);

  const handleView = (record: LicenseTableRow) => {
    router.push(`/licencas/view/${record.id}`);
  };

  const handleEdit = (record: LicenseTableRow) => {
    router.push(`/licencas/edit/${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLicense(Number(id));
      message.success("Licença excluída com sucesso.");
      await loadLicenses();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao excluir licença."
      );
    }
  };

  const handleAdd = () => {
    router.push("/licencas/addlicencas");
  };

  const filteredData = dataSource.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: TableColumn<LicenseTableRow>[] = [
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
      width: 280,
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      render: (text) => <strong>{capitalizeWords(text)}</strong>,
    },
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      width: 150,
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
      render: (text) => text || "-",
    },
    {
      title: "Órgão",
      dataIndex: "orgao",
      key: "orgao",
      width: 120,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "Cadastrado",
      dataIndex: "cadastrado",
      key: "cadastrado",
      width: 120,
      sorter: (a, b) => {
        const dateA = new Date(a.cadastrado.split("/").reverse().join("-"));
        const dateB = new Date(b.cadastrado.split("/").reverse().join("-"));
        return dateA.getTime() - dateB.getTime();
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
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Nova Licença
          </Button>
        </Space>
      </div>

      <Table<LicenseTableRow>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} licenças`,
        }}
        bordered
      />
    </div>
  );
};

export default LicencasPage;
