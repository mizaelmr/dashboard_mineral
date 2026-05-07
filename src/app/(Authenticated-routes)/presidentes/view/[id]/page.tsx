"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Descriptions, Tag } from "antd";
import { getPresidentById } from "../../actions";
import { capitalizeWords } from "@/utils/capitalize";
import { useActiveMandate } from "@/contexts/active-mandate-context";

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const ViewPresidentsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id as string);

  const { activeMandate } = useActiveMandate();
  const [loading, setLoading] = useState(Boolean(id));
  const [president, setPresident] = useState<{
    id: number;
    name: string;
    signatureS3Key?: string | null;
    createdAt?: string;
  } | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;
    queueMicrotask(() => setLoading(true));
    getPresidentById(id)
      .then((data) => {
        if (!cancelled) {
          setPresident(data);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const isActive = useMemo(
    () => activeMandate?.presidentId === president?.id,
    [activeMandate, president?.id]
  );

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!president) {
    return (
      <div>
        <Button onClick={() => router.push("/presidentes")} style={{ marginBottom: 16 }}>
          Voltar
        </Button>
        <div>Presidente não encontrado</div>
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
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/presidentes")}>
            Voltar
          </Button>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
            Detalhes do Presidente
          </h1>
        </div>
        <Button type="primary" onClick={() => router.push(`/presidentes/edit/${president.id}`)}>
          Editar
        </Button>
      </div>

      <section style={sectionStyle}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nome">
            <strong>{capitalizeWords(president.name)}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {isActive ? <Tag color="green">Ativo</Tag> : <Tag>Inativo</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Assinatura (S3)">
            {president.signatureS3Key || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Cadastrado em">
            {president.createdAt
              ? new Date(president.createdAt).toLocaleDateString("pt-BR")
              : "Não informado"}
          </Descriptions.Item>
        </Descriptions>
      </section>
    </div>
  );
};

export default ViewPresidentsPage;
