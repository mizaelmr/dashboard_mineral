"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getLicenseById } from "../../actions";
import { capitalizeWords } from "@/utils/capitalize";

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const ViewLicencaPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [licenca, setLicenca] = useState<{
    id: number;
    name: string;
    code?: string | null;
    authority?: string | null;
    createdAt?: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getLicenseById(Number(id))
      .then((data) => {
        if (!cancelled) setLicenca(data);
      })
      .catch(() => {
        if (!cancelled) setLicenca(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleEdit = () => {
    router.push(`/licencas/edit/${id}`);
  };

  const handleBack = () => {
    router.push("/licencas");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!licenca) {
    return (
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          Voltar
        </Button>
        <div>Licença não encontrada</div>
      </div>
    );
  }

  const cadastrado = licenca.createdAt
    ? new Date(licenca.createdAt).toLocaleDateString("pt-BR")
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
            Detalhes da Licença
          </h1>
        </div>
        <Button type="primary" onClick={handleEdit}>
          Editar Licença
        </Button>
      </div>

      <section style={sectionStyle}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nome">
            <strong>{capitalizeWords(licenca.name)}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Código">
            {licenca.code || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Órgão">
            {licenca.authority || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Cadastrado em">
            {cadastrado}
          </Descriptions.Item>
        </Descriptions>
      </section>
    </div>
  );
};

export default ViewLicencaPage;
