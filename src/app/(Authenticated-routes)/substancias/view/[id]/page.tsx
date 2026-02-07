"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getSubstanceById } from "../../actions";
import { capitalizeWords } from "@/utils/capitalize";

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

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    queueMicrotask(() => setLoading(true));
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

  const handleEdit = () => {
    router.push(`/substancias/edit/${id}`);
  };

  const handleBack = () => {
    router.push("/substancias");
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
    </div>
  );
};

export default ViewSubstanciaPage;
