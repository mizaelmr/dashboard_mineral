"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions, Tag, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getClientById } from "../../actions";
import { Client } from "@/types/client";
import { formatPhone } from "@/utils/formatPhone";

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const ViewClientePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<Client | null>(null);

  useEffect(() => {
    const loadCliente = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const clientData = await getClientById(Number(id));
        setCliente(clientData);
      } catch (error) {
        message.error(
          error instanceof Error ? error.message : "Failed to load client"
        );
        router.push("/clientes");
      } finally {
        setLoading(false);
      }
    };

    loadCliente();
  }, [id, router]);

  const handleEdit = () => {
    router.push(`/clientes/edit/${id}`);
  };

  const handleBack = () => {
    router.push("/clientes");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!cliente) {
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
        <div>Cliente não encontrado</div>
      </div>
    );
  }

  const isCNPJ = cliente.documentType === "CNPJ";
  const status = cliente.deletedAt ? "inativo" : "ativo";

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
            Detalhes do Cliente
          </h1>
        </div>
        <Button type="primary" onClick={handleEdit}>
          Editar Cliente
        </Button>
      </div>

      {/* Seção Dados */}
      <section style={sectionStyle}>
        <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
          Dados
        </h2>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Nome" span={2}>
            <strong>{cliente.name}</strong>
          </Descriptions.Item>
          {!isCNPJ && (
            <Descriptions.Item label="CPF">
              {cliente.documentNumber || "Não informado"}
            </Descriptions.Item>
          )}
          {isCNPJ && (
            <>
              <Descriptions.Item label="Razão Social">
                {cliente.legalName || cliente.name}
              </Descriptions.Item>
              <Descriptions.Item label="CNPJ">
                {cliente.documentNumber || "Não informado"}
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

      {/* Seção Contatos */}
      <section style={sectionStyle}>
        <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
          Contatos
        </h2>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Celular">
            {formatPhone(cliente.contact?.mobile) || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Telefone">
            {formatPhone(cliente.contact?.phone) || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="E-mail" span={2}>
            {cliente.contact?.email || cliente.email || "Não informado"}
          </Descriptions.Item>
        </Descriptions>
      </section>

      {cliente.address && (
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Endereço
          </h2>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="CEP">
              {cliente.address.zip || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Endereço" span={2}>
              {[cliente.address.street, cliente.address.number, cliente.address.complement, cliente.address.neighborhood]
                .filter(Boolean)
                .join(", ") || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Cidade">
              {cliente.address.city || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              {cliente.address.state || "Não informado"}
            </Descriptions.Item>
          </Descriptions>
        </section>
      )}
    </div>
  );
};

export default ViewClientePage;
