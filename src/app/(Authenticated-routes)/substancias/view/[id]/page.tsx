"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions, Table, Modal, Form, Input, message, Space } from "antd";
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { getSubstanceById, getAllTaxRates, createTaxRate, deleteTaxRate } from "../../actions";
import { capitalizeWords } from "@/utils/capitalize";
import type { TaxRate } from "@/types/tax-rate";

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const ViewSubstanciaPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [substancia, setSubstancia] = useState<{
    id: number;
    name: string;
    createdAt?: string;
  } | null>(null);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [taxRatesLoading, setTaxRatesLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadTaxRates = useCallback(async () => {
    setTaxRatesLoading(true);
    try {
      const all = await getAllTaxRates();
      const substanceId = Number(id);
      setTaxRates(all.filter((t) => t.substanceId === substanceId));
    } catch {
      setTaxRates([]);
    } finally {
      setTaxRatesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getSubstanceById(Number(id))
      .then((data) => {
        if (!cancelled) setSubstancia(data);
      })
      .catch(() => {
        if (!cancelled) setSubstancia(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !substancia) return;
    loadTaxRates();
  }, [id, substancia, loadTaxRates]);

  const handleEdit = () => {
    router.push(`/substancias/edit/${id}`);
  };

  const handleBack = () => {
    router.push("/substancias");
  };

  const handleAddTaxRate = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await createTaxRate({
        substance_id: Number(id),
        name: values.name.trim(),
        value: values.value.trim(),
        observation: values.observation?.trim() || undefined,
      });
      message.success("Imposto cadastrado com sucesso.");
      setModalOpen(false);
      loadTaxRates();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error(err instanceof Error ? err.message : "Falha ao cadastrar imposto.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTaxRate = (taxRate: TaxRate) => {
    Modal.confirm({
      title: "Excluir imposto",
      content: `Deseja excluir o imposto "${taxRate.name}"?`,
      okText: "Excluir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await deleteTaxRate(taxRate.id);
          message.success("Imposto excluído.");
          loadTaxRates();
        } catch (e) {
          message.error(e instanceof Error ? e.message : "Falha ao excluir.");
        }
      },
    });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!substancia) {
    return (
      <div>
        <Button onClick={handleBack} style={{ marginBottom: 16 }}>
          Voltar
        </Button>
        <div>Substância não encontrada</div>
      </div>
    );
  }

  const cadastrado = substancia.createdAt
    ? new Date(substancia.createdAt).toLocaleDateString("pt-BR")
    : "Não informado";

  const taxColumns = [
    { title: "Nome", dataIndex: "name", key: "name", render: (v: string) => capitalizeWords(v || "") },
    { title: "Valor", dataIndex: "value", key: "value" },
    { title: "Observação", dataIndex: "observation", key: "observation", render: (v: string | null) => v || "-" },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_: unknown, record: TaxRate) => (
        <Space>
          <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteTaxRate(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Voltar
          </Button>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
            Detalhes da Substância
          </h1>
        </div>
        <Button type="primary" onClick={handleEdit}>
          Editar Substância
        </Button>
      </div>

      <section style={sectionStyle}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nome">
            <strong>{capitalizeWords(substancia.name)}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Cadastrado em">
            {cadastrado}
          </Descriptions.Item>
        </Descriptions>
      </section>

      <section style={sectionStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Impostos</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTaxRate}>
            Adicionar imposto
          </Button>
        </div>
        <Table
          loading={taxRatesLoading}
          dataSource={taxRates}
          rowKey="id"
          columns={taxColumns}
          pagination={false}
          locale={{ emptyText: "Nenhum imposto cadastrado para esta substância." }}
        />
      </section>

      <Modal
        title="Adicionar imposto"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
        okText="Cadastrar"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: "Informe o nome." }, { min: 2, message: "Mínimo 2 caracteres." }]}
          >
            <Input placeholder="Ex: ICMS" maxLength={191} />
          </Form.Item>
          <Form.Item
            name="value"
            label="Valor"
            rules={[{ required: true, message: "Informe o valor." }]}
          >
            <Input placeholder="Ex: 18%" maxLength={191} />
          </Form.Item>
          <Form.Item name="observation" label="Observação">
            <Input placeholder="Opcional" maxLength={191} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewSubstanciaPage;
