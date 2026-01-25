"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, Row, Col, Button, Space } from "antd";
import { HookFormDatePicker, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";
import Table, { TableColumn } from "@/components/Table";
import dayjs from "dayjs";

interface RelatorioProcessosFilterValues {
  dataInicio: dayjs.Dayjs | null;
  dataFim: dayjs.Dayjs | null;
  processo: string;
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

const processosOptions: SelectOption[] = [
  { value: "1", label: "871.860/2006" },
  { value: "2", label: "871.861/2006" },
  { value: "3", label: "873.335/2006" },
];

const RelatorioProcessosPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<RelatorioNotaRow[]>([]);

  const { control, handleSubmit } = useForm<RelatorioProcessosFilterValues>({
    defaultValues: {
      dataInicio: dayjs("2025-01-01"),
      dataFim: dayjs("2026-01-25"),
      processo: "",
    },
  });

  const onFiltrar = (data: RelatorioProcessosFilterValues) => {
    console.log("Filtrar:", data);
    setDataSource([]);
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
      <Card title="Filtro de notas por processo">
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
              <HookFormSelect<RelatorioProcessosFilterValues>
                name="processo"
                control={control}
                label="Processo"
                options={processosOptions}
                placeholder="Selecione um Processo"
                style={{ width: 280 }}
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
        locale={{ emptyText: "Não a dados!" }}
        pagination={false}
      />
    </div>
  );
};

export default RelatorioProcessosPage;
