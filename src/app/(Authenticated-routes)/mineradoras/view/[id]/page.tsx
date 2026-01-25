"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface Mineradora {
  key: string;
  id: string;
  nome: string;
  processo: string;
  concessao: string;
  observacao: string;
}

// Dados de exemplo (mesmos da lista de mineradoras)
const mockMineradoras: Mineradora[] = [
  {
    key: "2",
    id: "2",
    nome: "MINAS DIVERSAS (871.861/2006)",
    processo: "871.861/2006",
    concessao: "",
    observacao: "ATIVA",
  },
  {
    key: "3",
    id: "3",
    nome: "MINAS DIVERSAS (871.860/2006)",
    processo: "871.860/2006",
    concessao: "",
    observacao: "ATIVA",
  },
  {
    key: "4",
    id: "4",
    nome: "MINAS DIVERSAS (873.335/2006)",
    processo: "873.335/2006",
    concessao: "",
    observacao: "ATIVA",
  },
];

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const ViewMineradoraPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [mineradora, setMineradora] = useState<Mineradora | null>(null);

  useEffect(() => {
    const loadMineradora = () => {
      setLoading(true);
      const mineradoraData = mockMineradoras.find((m) => m.id === id);
      setMineradora(mineradoraData || null);
      setLoading(false);
    };

    if (id) {
      loadMineradora();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/mineradoras/edit/${id}`);
  };

  const handleBack = () => {
    router.push("/mineradoras");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!mineradora) {
    return (
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          Voltar
        </Button>
        <div>Mineradora não encontrada</div>
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
            Detalhes da Mineradora
          </h1>
        </div>
        <Button type="primary" onClick={handleEdit}>
          Editar Mineradora
        </Button>
      </div>

      <section style={sectionStyle}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nome">
            <strong>{mineradora.nome}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Processo">
            {mineradora.processo}
          </Descriptions.Item>
          <Descriptions.Item label="Número de Concessão">
            {mineradora.concessao || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Observação">
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: mineradora.observacao === "ATIVA" ? "#f6ffed" : "#fff2e8",
                color: mineradora.observacao === "ATIVA" ? "#52c41a" : "#fa8c16",
                fontWeight: 500,
              }}
            >
              {mineradora.observacao}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </section>
    </div>
  );
};

export default ViewMineradoraPage;
