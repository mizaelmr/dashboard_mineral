"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface Cliente {
  key: string;
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  status: "ativo" | "inativo";
}

interface ClienteDetalhes extends Cliente {
  razaoSocial?: string;
  cep?: string;
  endereco?: string;
  complemento?: string;
  bairro?: string;
  numero?: string;
  cel?: string;
  tel?: string;
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

// Dados de exemplo (mesmos da lista de clientes)
const mockClientes: Cliente[] = [
  {
    key: "1",
    id: "1",
    nome: "João Silva",
    cpfCnpj: "123.456.789-00",
    email: "joao.silva@email.com",
    telefone: "(71) 99999-9999",
    cidade: "Salvador",
    estado: "BA",
    status: "ativo",
  },
  {
    key: "2",
    id: "2",
    nome: "Maria Santos",
    cpfCnpj: "987.654.321-00",
    email: "maria.santos@email.com",
    telefone: "(71) 88888-8888",
    cidade: "Feira de Santana",
    estado: "BA",
    status: "ativo",
  },
  {
    key: "3",
    id: "3",
    nome: "Empresa Mineração LTDA",
    cpfCnpj: "12.345.678/0001-90",
    email: "contato@mineracao.com.br",
    telefone: "(71) 77777-7777",
    cidade: "Vitória da Conquista",
    estado: "BA",
    status: "ativo",
  },
  {
    key: "4",
    id: "4",
    nome: "Pedro Oliveira",
    cpfCnpj: "111.222.333-44",
    email: "pedro.oliveira@email.com",
    telefone: "(71) 66666-6666",
    cidade: "Ilhéus",
    estado: "BA",
    status: "inativo",
  },
  {
    key: "5",
    id: "5",
    nome: "Ana Costa",
    cpfCnpj: "555.666.777-88",
    email: "ana.costa@email.com",
    telefone: "(71) 55555-5555",
    cidade: "Juazeiro",
    estado: "BA",
    status: "ativo",
  },
];

// Função para buscar dados completos do cliente (simular API)
const fetchClienteDetalhes = (id: string): ClienteDetalhes | null => {
  const cliente = mockClientes.find((c) => c.id === id);
  if (!cliente) return null;

  // Simular dados completos (em produção viria da API)
  const isCNPJ = cliente.cpfCnpj.includes("/");
  
  return {
    ...cliente,
    razaoSocial: isCNPJ ? cliente.nome : "",
    cep: "40000-000",
    endereco: "Rua Exemplo, 123",
    complemento: "Apto 101",
    bairro: "Centro",
    numero: "123",
    cel: cliente.telefone,
    tel: "(71) 3333-3333",
  };
};

const ViewClientePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<ClienteDetalhes | null>(null);

  useEffect(() => {
    const loadCliente = () => {
      setLoading(true);
      const clienteData = fetchClienteDetalhes(id);
      setCliente(clienteData);
      setLoading(false);
    };

    if (id) {
      loadCliente();
    }
  }, [id]);

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

  const isCNPJ = cliente.cpfCnpj.includes("/");
  const estadoNome = cliente.estado;

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
            <strong>{cliente.nome}</strong>
          </Descriptions.Item>
          {!isCNPJ && (
            <Descriptions.Item label="CPF">
              {cliente.cpfCnpj}
            </Descriptions.Item>
          )}
          {isCNPJ && (
            <>
              <Descriptions.Item label="Razão Social">
                {cliente.razaoSocial || cliente.nome}
              </Descriptions.Item>
              <Descriptions.Item label="CNPJ">
                {cliente.cpfCnpj}
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="Status">
            <Tag color={cliente.status === "ativo" ? "green" : "orange"}>
              {cliente.status === "ativo" ? "Ativo" : "Inativo"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </section>

      {/* Seção Endereço */}
      <section style={sectionStyle}>
        <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
          Endereço
        </h2>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="CEP">
            {cliente.cep || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Endereço">
            {cliente.endereco || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Número">
            {cliente.numero || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Complemento">
            {cliente.complemento || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Bairro">
            {cliente.bairro || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Cidade">
            {cliente.cidade}
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            {estadoNome}
          </Descriptions.Item>
        </Descriptions>
      </section>

      {/* Seção Contatos */}
      <section style={sectionStyle}>
        <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
          Contatos
        </h2>
        <Descriptions bordered column={3}>
          <Descriptions.Item label="Celular">
            {cliente.cel || cliente.telefone || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="Telefone">
            {cliente.tel || "Não informado"}
          </Descriptions.Item>
          <Descriptions.Item label="E-mail">
            {cliente.email}
          </Descriptions.Item>
        </Descriptions>
      </section>
    </div>
  );
};

export default ViewClientePage;
