"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Card, Row, Col, Button, Space, message } from "antd";
import { HookFormDatePicker, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";
import Table, { TableColumn } from "@/components/Table";
import dayjs from "dayjs";
import { getClientsByType } from "../../clientes/actions";
import { capitalizeWords } from "@/utils/capitalize";
import type { Client, Address } from "@/types/client";

interface RelatorioClientesFilterValues {
  dataInicio: dayjs.Dayjs | null;
  dataFim: dayjs.Dayjs | null;
  cliente: string;
}

interface RelatorioNotaRow {
  key: string;
  index: number;
  cliente: string;
  endereco: string;
  descricao: string;
  dataGerada: string;
  valorPeso: string;
  valorKLg: string;
  valorFinal: string;
}

function formatAddressShort(addr: Address | null | undefined): string {
  if (!addr) return "-";
  const parts: string[] = [];
  if (addr.street) parts.push(capitalizeWords(addr.street));
  if (addr.number) parts.push(addr.number);
  if (addr.neighborhood) parts.push(capitalizeWords(addr.neighborhood));
  if (addr.city) parts.push(capitalizeWords(addr.city));
  if (addr.state) parts.push(addr.state);
  return parts.length ? parts.join(", ") : "-";
}

function clientToReportRow(client: Client, index: number): RelatorioNotaRow {
  return {
    key: String(client.id),
    index: index + 1,
    cliente: capitalizeWords(client.name),
    endereco: formatAddressShort(client.address),
    descricao: "-",
    dataGerada: "-",
    valorPeso: "-",
    valorKLg: "-",
    valorFinal: "-",
  };
}

const RelatorioClientesPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<RelatorioNotaRow[]>([]);
  const [clientesOptions, setClientesOptions] = useState<SelectOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  const loadClients = useCallback(async () => {
    setOptionsLoading(true);
    try {
      const clients = await getClientsByType(1);
      setClientesOptions(
        clients.map((c) => ({ value: String(c.id), label: capitalizeWords(c.name) }))
      );
      return clients;
    } catch {
      message.error("Falha ao carregar clientes.");
      return [];
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const { control, handleSubmit } = useForm<RelatorioClientesFilterValues>({
    defaultValues: {
      dataInicio: dayjs("2025-01-01"),
      dataFim: dayjs("2026-01-25"),
      cliente: "",
    },
  });

  const onFiltrar = async (data: RelatorioClientesFilterValues) => {
    setTableLoading(true);
    try {
      const clients = await getClientsByType(1);
      let filtered = clients;
      if (data.cliente) {
        filtered = clients.filter((c) => String(c.id) === data.cliente);
      }
      setDataSource(filtered.map((c, i) => clientToReportRow(c, i)));
    } catch {
      message.error("Falha ao filtrar clientes.");
      setDataSource([]);
    } finally {
      setTableLoading(false);
    }
  };

  const onImprimir = () => {
    window.print();
  };

  const columns: TableColumn<RelatorioNotaRow>[] = [
    { title: "#", dataIndex: "index", key: "index", width: 60 },
    { title: "Cliente", dataIndex: "cliente", key: "cliente" },
    { title: "End.", dataIndex: "endereco", key: "endereco" },
    { title: "Descrição", dataIndex: "descricao", key: "descricao" },
    { title: "Data Gerada", dataIndex: "dataGerada", key: "dataGerada" },
    { title: "Valor peso", dataIndex: "valorPeso", key: "valorPeso" },
    { title: "Valor KL/g", dataIndex: "valorKLg", key: "valorKLg" },
    { title: "Valor final", dataIndex: "valorFinal", key: "valorFinal" },
  ];

  return (
    <div>
      <Card title="Filtro de notas">
        <form onSubmit={handleSubmit(onFiltrar)}>
          <Row gutter={16} align="bottom">
            <Col>
              <HookFormDatePicker
                name="dataInicio"
                control={control as never}
                label="Data"
                format="DD/MM/YYYY"
                placeholder="dd/mm/aaaa"
              />
            </Col>
            <Col>
              <HookFormDatePicker
                name="dataFim"
                control={control as never}
                label="Data"
                format="DD/MM/YYYY"
                placeholder="dd/mm/aaaa"
              />
            </Col>
            <Col>
              <HookFormSelect<RelatorioClientesFilterValues>
                name="cliente"
                control={control}
                label="Cliente"
                options={clientesOptions}
                placeholder="Selecione um Cliente"
                style={{ width: 280 }}
                loading={optionsLoading}
              />
            </Col>
            <Col>
              <Space>
                <Button type="primary" htmlType="submit">
                  Filtrar
                </Button>
                <Button htmlType="button" onClick={onImprimir}>Imprimir</Button>
              </Space>
            </Col>
          </Row>
        </form>
      </Card>

      <Table<RelatorioNotaRow>
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        loading={tableLoading}
        locale={{ emptyText: "Não a dados!" }}
        pagination={false}
      />
    </div>
  );
};

export default RelatorioClientesPage;
