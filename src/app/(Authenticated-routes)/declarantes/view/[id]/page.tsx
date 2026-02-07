"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions, Tag, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getClientById } from "../../../clientes/actions";
import { Client } from "@/types/client";
import { formatPhone } from "@/utils/formatPhone";
import { capitalizeWords } from "@/utils/capitalize";
import { formatDocument } from "@/utils/documents";

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const ViewDeclarantePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [declarante, setDeclarante] = useState<Client | null>(null);

  useEffect(() => {
    const loadDeclarante = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const clientData = await getClientById(Number(id));
        setDeclarante(clientData);
      } catch (error) {
        message.error(
          error instanceof Error ? error.message : "Falha ao carregar declarante."
        );
        router.push("/declarantes");
      } finally {
        setLoading(false);
      }
    };

    loadDeclarante();
  }, [id, router]);

  const handleEdit = () => {
    router.push(`/declarantes/edit/${id}`);
  };

  const handleBack = () => {
    router.push("/declarantes");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!declarante) {
    return (
      <div>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          Voltar
        </Button>
        <div>Declarante não encontrado</div>
      </div>
    );
  }

  const isCNPJ = declarante.documentType === "CNPJ";
  const status = declarante.deletedAt ? "inativo" : "ativo";

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
          <Button type="default" icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Voltar
          </Button>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
            Detalhes do Declarante
          </h1>
        </div>
        <Button type="primary" onClick={handleEdit}>
          Editar Declarante
        </Button>
      </div>

      <section style={sectionStyle}>
        <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
          Dados
        </h2>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Nome" span={2}>
            <strong>{capitalizeWords(declarante.name)}</strong>
          </Descriptions.Item>
          {!isCNPJ && (
            <Descriptions.Item label="CPF">
              {formatDocument(declarante.documentNumber, "CPF") || "Não informado"}
            </Descriptions.Item>
          )}
          {isCNPJ && (
            <>
              <Descriptions.Item label="Razão Social">
                {capitalizeWords(declarante.legalName || declarante.name)}
              </Descriptions.Item>
              <Descriptions.Item label="CNPJ">
                {formatDocument(declarante.documentNumber, "CNPJ") || "Não informado"}
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="Status">
            <Tag color={status === "ativo" ? "green" : "orange"}>
              {status === "ativo" ? "Ativo" : "Inativo"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
          Contatos
        </h2>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Celular">
            {formatPhone(declarante.contact?.mobile) || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Telefone">
            {formatPhone(declarante.contact?.phone) || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="E-mail" span={2}>
            {declarante.contact?.email || declarante.email || "Não informado"}
          </Descriptions.Item>
        </Descriptions>
      </section>

      {declarante.address && (
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Endereço
          </h2>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="CEP">
              {declarante.address.zip || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Endereço" span={2}>
              {[
                capitalizeWords(declarante.address.street),
                declarante.address.number,
                capitalizeWords(declarante.address.complement),
                capitalizeWords(declarante.address.neighborhood),
              ]
                .filter(Boolean)
                .join(", ") || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Cidade">
              {capitalizeWords(declarante.address.city) || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              {capitalizeWords(declarante.address.state) || "Não informado"}
            </Descriptions.Item>
          </Descriptions>
        </section>
      )}
    </div>
  );
};

export default ViewDeclarantePage;
