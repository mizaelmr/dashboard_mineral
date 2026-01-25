"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface Processo {
  key: string;
  id: string;
  nome: string;
  numero: string;
  hectares: string;
  observacao: string;
}

// Dados de exemplo (mesmos da lista de processos)
const mockProcessos: Processo[] = [
  {
    key: "1",
    id: "1",
    nome: "871.860/2006",
    numero: "871.860/2006",
    hectares: "894,00",
    observacao: "Não informado",
  },
  {
    key: "2",
    id: "2",
    nome: "871.861/2006",
    numero: "871.861/2006",
    hectares: "923,25",
    observacao: "Não informado",
  },
  {
    key: "3",
    id: "3",
    nome: "873.335/2006",
    numero: "873.335/2006",
    hectares: "871,51",
    observacao: "Não informado",
  },
];

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const ViewProcessoPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [processo, setProcesso] = useState<Processo | null>(null);

  useEffect(() => {
    const loadProcesso = () => {
      setLoading(true);
      const processoData = mockProcessos.find((p) => p.id === id);
      setProcesso(processoData || null);
      setLoading(false);
    };

    if (id) {
      loadProcesso();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/processos/edit/${id}`);
  };

  const handleBack = () => {
    router.push("/processos");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!processo) {
    return (
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          Voltar
        </Button>
        <div>Processo não encontrado</div>
      </div>
    );
  }

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
            Detalhes do Processo
          </h1>
        </div>
        <Button type="primary" onClick={handleEdit}>
          Editar Processo
        </Button>
      </div>

      <section style={sectionStyle}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nome">
            <strong>{processo.nome}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Número">
            {processo.numero}
          </Descriptions.Item>
          <Descriptions.Item label="Hectares">
            {processo.hectares}
          </Descriptions.Item>
          <Descriptions.Item label="Observação">
            {processo.observacao}
          </Descriptions.Item>
        </Descriptions>
      </section>
    </div>
  );
};

export default ViewProcessoPage;
