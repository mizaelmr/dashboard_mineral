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
  getAllProcesses,
  deleteProcess,
} from "./actions";
import {
  ProcessTableRow,
  mapProcessToTableRow,
} from "@/types/process";
import { capitalizeWords } from "@/utils/capitalize";

const ProcessosPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<ProcessTableRow[]>([]);

  const loadProcesses = useCallback(async () => {
    setLoading(true);
    try {
      const processes = await getAllProcesses();
      setDataSource(processes.map(mapProcessToTableRow));
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao carregar processos."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProcesses();
  }, [loadProcesses]);

  const handleView = (record: ProcessTableRow) => {
    router.push(`/processos/view/${record.id}`);
  };

  const handleEdit = (record: ProcessTableRow) => {
    router.push(`/processos/edit/${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProcess(Number(id));
      message.success("Processo excluído com sucesso.");
      await loadProcesses();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao excluir processo."
      );
    }
  };

  const handleAdd = () => {
    router.push("/processos/addprocessos");
  };

  const filteredData = dataSource.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: TableColumn<ProcessTableRow>[] = [
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
        const aVal = parseFloat(String(a.hectares).replace(",", ".")) || 0;
        const bVal = parseFloat(String(b.hectares).replace(",", ".")) || 0;
        return aVal - bVal;
      },
    },
    {
      title: "Observação",
      dataIndex: "observacao",
      key: "observacao",
      width: 200,
      render: (text) => text || "-",
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
          Processos
        </h1>
        <Space>
          <Input
            placeholder="Buscar processos..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Novo Processo
          </Button>
        </Space>
      </div>

      <Table<ProcessTableRow>
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
