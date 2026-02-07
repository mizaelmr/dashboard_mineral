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
import { getAllSubstances, deleteSubstance } from "./actions";
import {
  SubstanceTableRow,
  mapSubstanceToTableRow,
} from "@/types/substance";
import { capitalizeWords } from "@/utils/capitalize";

const SubstânciasPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<SubstanceTableRow[]>([]);

  const loadSubstances = useCallback(async () => {
    setLoading(true);
    try {
      const substances = await getAllSubstances();
      setDataSource(substances.map(mapSubstanceToTableRow));
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao carregar substâncias."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubstances();
  }, [loadSubstances]);

  const handleView = (record: SubstanceTableRow) => {
    router.push(`/substancias/view/${record.id}`);
  };

  const handleEdit = (record: SubstanceTableRow) => {
    router.push(`/substancias/edit/${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubstance(Number(id));
      message.success("Substância excluída com sucesso.");
      await loadSubstances();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao excluir substância."
      );
    }
  };

  const handleAdd = () => {
    router.push("/substancias/addsubstancias");
  };

  const filteredData = dataSource.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: TableColumn<SubstanceTableRow>[] = [
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
      render: (text) => <strong>{capitalizeWords(text)}</strong>,
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
          Substâncias
        </h1>
        <Space>
          <Input
            placeholder="Buscar substâncias..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
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

      <Table<SubstanceTableRow>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} substâncias`,
        }}
        bordered
      />
    </div>
  );
};

export default SubstânciasPage;
