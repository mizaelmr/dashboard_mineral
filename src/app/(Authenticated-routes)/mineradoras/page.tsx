"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  getAllMiningSites,
  getAllProcesses,
  deleteMiningSite,
} from "./actions";
import {
  MiningSiteTableRow,
  mapMiningSiteToTableRow,
} from "@/types/mining-site";
import { capitalizeWords } from "@/utils/capitalize";

const MineradorasPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<MiningSiteTableRow[]>([]);

  const loadMiningSites = useCallback(async () => {
    setLoading(true);
    try {
      const [sites, processes] = await Promise.all([
        getAllMiningSites(),
        getAllProcesses(),
      ]);
      const byId: Record<number, string> = {};
      processes.forEach((p) => {
        byId[p.id] = p.number ?? "";
      });
      setDataSource(sites.map((s) => mapMiningSiteToTableRow(s, byId)));
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao carregar mineradoras."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMiningSites();
  }, [loadMiningSites]);

  const handleView = (record: MiningSiteTableRow) => {
    router.push(`/mineradoras/view/${record.id}`);
  };

  const handleEdit = (record: MiningSiteTableRow) => {
    router.push(`/mineradoras/edit/${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMiningSite(Number(id));
      message.success("Mineradora excluída com sucesso.");
      await loadMiningSites();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao excluir mineradora."
      );
    }
  };

  const handleAdd = () => {
    router.push("/mineradoras/addmineradoras");
  };

  const filteredData = dataSource.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: TableColumn<MiningSiteTableRow>[] = [
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
      width: 300,
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      render: (text) => <strong>{capitalizeWords(text)}</strong>,
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
            backgroundColor:
              observacao?.toUpperCase() === "ATIVA" ? "#f6ffed" : "#fff2e8",
            color: observacao?.toUpperCase() === "ATIVA" ? "#52c41a" : "#fa8c16",
            fontWeight: 500,
          }}
        >
          {observacao || "-"}
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
            onChange={(e) => setSearchText(e.target.value)}
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

      <Table<MiningSiteTableRow>
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
