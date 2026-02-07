"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getMiningSiteById, getAllProcesses } from "../../actions";
import { MiningSite } from "@/types/mining-site";
import { capitalizeWords } from "@/utils/capitalize";

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
  const [mineradora, setMineradora] = useState<MiningSite | null>(null);
  const [processNumber, setProcessNumber] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getMiningSiteById(Number(id)),
      getAllProcesses(),
    ])
      .then(([site, processes]) => {
        if (cancelled) return;
        setMineradora(site);
        if (site?.processId) {
          const process = processes.find((p) => p.id === site.processId);
          setProcessNumber(process?.number ?? String(site.processId));
        }
      })
      .catch(() => {
        if (!cancelled) setMineradora(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
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
            <strong>{capitalizeWords(mineradora.name)}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Processo">
            {processNumber || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Número de Concessão">
            {mineradora.concessionNumber || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Observação">
            {mineradora.observation ? (
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor:
                    mineradora.observation.toUpperCase() === "ATIVA"
                      ? "#f6ffed"
                      : "#fff2e8",
                  color:
                    mineradora.observation.toUpperCase() === "ATIVA"
                      ? "#52c41a"
                      : "#fa8c16",
                  fontWeight: 500,
                }}
              >
                {mineradora.observation}
              </span>
            ) : (
              "Não informado"
            )}
          </Descriptions.Item>
        </Descriptions>
      </section>
    </div>
  );
};

export default ViewMineradoraPage;
