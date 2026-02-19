"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Row, Col, Statistic, Button, Space, message } from "antd";
import {
  FileTextOutlined,
  TeamOutlined,
  DollarOutlined,
  BankOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { isAuthenticated } from "@/lib/auth";
import { useActiveMandate } from "@/contexts/active-mandate-context";
import {
  getAllCertificates,
  getCertificateValueStats,
} from "../certificados/actions";
import { getClientsByType } from "../clientes/actions";
import { capitalizeWords } from "@/utils/capitalize";
import Table, { TableColumn } from "@/components/Table";

interface DashboardStats {
  totalCertificates: number;
  totalClients: number;
  totalValueThisMonth: number;
  totalValueAllTime: number;
  recentCertificates: Array<{
    key: string;
    id: string;
    displayNumber: string;
    clientName: string;
    createdAt: string;
    valTotal: string;
  }>;
  clientNameMap: Record<number, string>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(dateStr: string | undefined): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export default function Dashboard() {
  const router = useRouter();
  const { activeMandate, loading: mandateLoading } = useActiveMandate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const [certificates, clients, valueStats] = await Promise.all([
        getAllCertificates(),
        getClientsByType(1),
        getCertificateValueStats(),
      ]);
      const clientNameMap: Record<number, string> = {};
      clients.forEach((c) => {
        clientNameMap[c.id] = capitalizeWords(c.name ?? "");
      });
      const sortedByDate = [...certificates].sort((a, b) => {
        const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tB - tA;
      });
      const recentCertificates = sortedByDate.slice(0, 10).map((c) => ({
        key: String(c.id),
        id: String(c.id),
        displayNumber: c.displayNumber ?? String(c.id),
        clientName: clientNameMap[c.client_id] ?? String(c.client_id),
        createdAt: formatDate(c.createdAt),
        valTotal:
          c.valTotal != null
            ? formatCurrency(Number(c.valTotal))
            : "-",
      }));
      setStats({
        totalCertificates: certificates.length,
        totalClients: clients.length,
        totalValueThisMonth: valueStats.totalValueThisMonth,
        totalValueAllTime: valueStats.totalValue,
        recentCertificates,
        clientNameMap,
      });
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao carregar dados."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (!isAuthenticated()) {
    return null;
  }

  const recentColumns: TableColumn<DashboardStats["recentCertificates"][0]>[] = [
    {
      title: "Nº",
      dataIndex: "displayNumber",
      key: "displayNumber",
      width: 100,
    },
    {
      title: "Cliente",
      dataIndex: "clientName",
      key: "clientName",
      ellipsis: true,
    },
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
    },
    {
      title: "Valor",
      dataIndex: "valTotal",
      key: "valTotal",
      width: 120,
      align: "right",
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<ArrowRightOutlined />}
          onClick={() => router.push(`/certificados/view/${record.id}`)}
        >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <h1 style={{ marginBottom: 24, fontSize: "24px", fontWeight: 600 }}>
        Início
      </h1>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Certificados"
              value={stats?.totalCertificates ?? 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Clientes"
              value={stats?.totalClients ?? 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} title="Valor (certificados)">
            <Statistic
              title="Este mês"
              value={stats?.totalValueThisMonth ?? 0}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ fontSize: "1.5rem", fontWeight: 600 }}
            />
            <div style={{ marginTop: 8, fontSize: "0.875rem", color: "var(--ant-color-text-secondary)" }}>
              Total geral: {formatCurrency(stats?.totalValueAllTime ?? 0)}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={mandateLoading} title="Mandato ativo">
            {activeMandate ? (
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <span>
                  <UserOutlined />{" "}
                  {activeMandate.presidentName
                    ? capitalizeWords(activeMandate.presidentName)
                    : "—"}
                </span>
                <span>
                  <CalendarOutlined />{" "}
                  {formatDateOnly(activeMandate.startedAt)}
                  {activeMandate.endedAt
                    ? ` – ${formatDateOnly(activeMandate.endedAt)}`
                    : " (em vigor)"}
                </span>
              </Space>
            ) : (
              <span style={{ color: "var(--ant-color-text-secondary)" }}>
                Nenhum mandato ativo
              </span>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Ações rápidas">
            <Space wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push("/certificados/addcertificados")}
              >
                Novo certificado
              </Button>
              <Button
                icon={<TeamOutlined />}
                onClick={() => router.push("/clientes")}
              >
                Clientes
              </Button>
              <Button
                icon={<FileTextOutlined />}
                onClick={() => router.push("/relatorios/clientes")}
              >
                Relatório clientes
              </Button>
              <Button
                icon={<BankOutlined />}
                onClick={() => router.push("/presidentes")}
              >
                Presidentes
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title="Últimos certificados"
        extra={
          <Button
            type="link"
            onClick={() => router.push("/certificados")}
            icon={<ArrowRightOutlined />}
          >
            Ver todos
          </Button>
        }
      >
        <Table
          columns={recentColumns}
          dataSource={stats?.recentCertificates ?? []}
          loading={loading}
          rowKey="key"
          pagination={false}
          size="small"
          bordered
        />
      </Card>
    </div>
  );
}
