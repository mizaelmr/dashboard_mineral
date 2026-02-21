"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/Table";
import { Button, Space, Input, message, Modal, Tooltip } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getAllCertificates, deleteCertificate } from "./actions";
import { getClientsByType } from "../clientes/actions";
import { capitalizeWords } from "@/utils/capitalize";

interface CertificadoRow {
  key: string;
  id: string;
  cliente: string;
  descricao: string;
  dataGerada: string;
  valor: string;
}

const CertificadosPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<CertificadoRow[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [certificates, clientsType1] = await Promise.all([
        getAllCertificates(),
        getClientsByType(1),
      ]);
      const map: Record<number, string> = {};
      clientsType1.forEach((c) => {
        map[c.id] = capitalizeWords(c.name ?? "");
      });
      const rows: CertificadoRow[] = certificates.map((c) => ({
        key: String(c.id),
        id: String(c.id),
        cliente: map[c.client_id] ?? String(c.client_id),
        descricao: c.description ?? "",
        dataGerada: c.createdAt
          ? new Date(c.createdAt).toLocaleString("pt-BR")
          : "",
        valor:
          c.valTotal != null
            ? `R$ ${Number(c.valTotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            : "",
      }));
      setDataSource(rows);
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao carregar certificados."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns: TableColumn<CertificadoRow>[] = [
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
      width: 90,
      sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
      width: 240,
      ellipsis: true,
      sorter: (a, b) => a.cliente.localeCompare(b.cliente),
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      width: 160,
      sorter: (a, b) => a.descricao.localeCompare(b.descricao),
    },
    {
      title: "Data gerada",
      dataIndex: "dataGerada",
      key: "dataGerada",
      width: 160,
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
      width: 130,
      align: "right",
      sorter: (a, b) => {
        const aValue = parseFloat(
          a.valor.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
        );
        const bValue = parseFloat(
          b.valor.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
        );
        return aValue - bValue;
      },
    },
    {
      title: "Ações",
      key: "acoes",
      width: 110,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Visualizar">
            <Button
              type="text"
              icon={<EyeOutlined />}
              style={{ color: "#1677ff" }}
              onClick={() => router.push(`/certificados/view/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              style={{ color: "#faad14" }}
              onClick={() => router.push(`/certificados/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => openDeleteModal(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const openDeleteModal = (id: string) => {
    setPendingDeleteId(id);
    setDeleteReason("");
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    const reason = deleteReason.trim();
    if (!reason) {
      message.warning("Informe o motivo do cancelamento para continuar.");
      return;
    }
    if (!pendingDeleteId) {
      setDeleteModalOpen(false);
      return;
    }
    setDeleting(true);
    try {
      await deleteCertificate(Number(pendingDeleteId), reason);
      message.success("Certificado cancelado com sucesso.");
      setDeleteModalOpen(false);
      setPendingDeleteId(null);
      await loadData();
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Falha ao cancelar certificado."
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredData = useMemo(
    () =>
      dataSource.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        )
      ),
    [dataSource, searchText]
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
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/certificados/addcertificados")}
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
        bordered
      />
      <Modal
        title="Cancelar certificado"
        open={deleteModalOpen}
        onCancel={() => {
          if (deleting) return;
          setDeleteModalOpen(false);
        }}
        onOk={handleDelete}
        okText="Cancelar certificado"
        cancelText="Fechar"
        confirmLoading={deleting}
        okButtonProps={{ danger: true, disabled: deleting }}
      >
        <p style={{ marginBottom: 12 }}>
          Este certificado ficará cancelado e não aparecerá mais na listagem ativa.
        </p>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
          Motivo do cancelamento
        </label>
        <Input.TextArea
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          rows={3}
          maxLength={512}
          placeholder="Ex: Certificado emitido com dados incorretos"
        />
      </Modal>
    </div>
  );
};

export default CertificadosPage;
