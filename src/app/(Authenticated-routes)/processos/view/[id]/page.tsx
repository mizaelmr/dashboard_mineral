"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getProcessById } from "../../actions";
import { capitalizeWords } from "@/utils/capitalize";

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
  const [processo, setProcesso] = useState<{
    id: number;
    number: string;
    name?: string | null;
    hectares?: string | null;
    observation?: string | null;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getProcessById(Number(id))
      .then((data) => {
        if (!cancelled) setProcesso(data);
      })
      .catch(() => {
        if (!cancelled) setProcesso(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
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
            <strong>
              {capitalizeWords(processo.name ?? processo.number)}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Número">
            {processo.number}
          </Descriptions.Item>
          <Descriptions.Item label="Hectares">
            {processo.hectares ?? "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Observação">
            {processo.observation ?? "Não informado"}
          </Descriptions.Item>
        </Descriptions>
      </section>
    </div>
  );
};

export default ViewProcessoPage;
