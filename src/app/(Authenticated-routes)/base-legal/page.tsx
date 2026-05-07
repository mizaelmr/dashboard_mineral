"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Form, Input, Checkbox, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
  getAllBaseLegal,
  createBaseLegal,
  updateBaseLegal,
} from "./actions";
import {
  type BaseLegalContent,
  parseBaseLegalContent,
  DEFAULT_BASE_LEGAL,
} from "@/types/base-legal";

const { TextArea } = Input;

const BaseLegalPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [form] = Form.useForm<BaseLegalContent>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAllBaseLegal()
      .then((list) => {
        if (cancelled) return;
        const first = list?.[0];
        if (first) {
          setCurrentId(first.id);
          const parsed = parseBaseLegalContent(first.content);
          if (parsed) {
            form.setFieldsValue(parsed);
          } else {
            form.setFieldsValue(DEFAULT_BASE_LEGAL);
          }
        } else {
          setCurrentId(null);
          form.setFieldsValue(DEFAULT_BASE_LEGAL);
        }
      })
      .catch(() => {
        if (!cancelled) form.setFieldsValue(DEFAULT_BASE_LEGAL);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const content: BaseLegalContent = {
        title: values.title?.trim() ?? DEFAULT_BASE_LEGAL.title,
        description: values.description?.trim() ?? DEFAULT_BASE_LEGAL.description,
        siteUrl: values.siteUrl?.trim() ?? DEFAULT_BASE_LEGAL.siteUrl,
        showSubstanceTaxes: values.showSubstanceTaxes ?? DEFAULT_BASE_LEGAL.showSubstanceTaxes,
      };
      setSaving(true);
      if (currentId != null) {
        await updateBaseLegal(currentId, content);
        message.success("Base legal atualizada com sucesso.");
      } else {
        const created = await createBaseLegal(content);
        setCurrentId(created.id);
        message.success("Base legal cadastrada com sucesso.");
      }
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error(err instanceof Error ? err.message : "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
          Base Legal
        </h1>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={saving}
        >
          Salvar
        </Button>
      </div>

      <Card title="Texto exibido no rodapé do certificado">
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: "Obrigatório." }]}
          >
            <Input placeholder="Ex: Informações: BASE LEGAL: Circulação, Impostos e Taxas" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: "Obrigatório." }]}
          >
            <TextArea rows={5} placeholder={"Ex:\nValor aproximado correspondente à totalidade dos tributos...\nConsulta de autenticidade do Certificado de origem informando o código de verificação através do site"} />
          </Form.Item>
          <Form.Item
            name="siteUrl"
            label="URL do site (exibido como link)"
            rules={[{ required: true, message: "Obrigatório." }]}
          >
            <Input placeholder="Ex: www.cooperativacmb.com.br" />
          </Form.Item>
          <Form.Item
            name="showSubstanceTaxes"
            valuePropName="checked"
          >
            <Checkbox>Deseja apresentar as taxas da substância selecionada?</Checkbox>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BaseLegalPage;
