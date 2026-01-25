"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Descriptions, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";

export interface DadosEmpresa {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  ie: string;
  cep: string;
  endereco: string;
  bairro: string;
  numero: string;
  complemento: string;
  fone1: string;
  fone2: string;
  email: string;
}

// Dados mockados da empresa
export const mockDadosEmpresa: DadosEmpresa = {
  nome: "COOPERATIVA MINERAL DA BAHIA",
  razaoSocial: "COOPERATIVA MINERAL DA BAHIA - CMB",
  cnpj: "08.020.967/0001-47",
  ie: "69.031.374-NO",
  cep: "44770-000",
  endereco: "RUA PETROLINA",
  bairro: "SERRA DA CARNAIBA - PINDOBAÇU - BA",
  numero: "215",
  complemento: "Nada informado",
  fone1: "(74) 99961-1561",
  fone2: "",
  email: "mail@mail.com",
};

const DadosEmpresaPage: React.FC = () => {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/dados-empresa/edit");
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
          Dados da Empresa
        </h1>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleEdit}
        >
          Editar
        </Button>
      </div>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Seção Dados */}
        <Card title="Dados" style={{ width: "100%" }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Nome">
              {mockDadosEmpresa.nome}
            </Descriptions.Item>
            <Descriptions.Item label="Razão Social">
              {mockDadosEmpresa.razaoSocial}
            </Descriptions.Item>
            <Descriptions.Item label="CNPJ">
              {mockDadosEmpresa.cnpj}
            </Descriptions.Item>
            <Descriptions.Item label="IE">
              {mockDadosEmpresa.ie}
            </Descriptions.Item>
            <Descriptions.Item label="Fone 1">
              {mockDadosEmpresa.fone1}
            </Descriptions.Item>
            <Descriptions.Item label="Fone 2">
              {mockDadosEmpresa.fone2 || ""}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail">
              {mockDadosEmpresa.email || "----------"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Seção Localização */}
        <Card title="Localização" style={{ width: "100%" }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Endereço">
              {mockDadosEmpresa.endereco}
            </Descriptions.Item>
            <Descriptions.Item label="Número">
              {mockDadosEmpresa.numero}
            </Descriptions.Item>
            <Descriptions.Item label="Bairro">
              {mockDadosEmpresa.bairro}
            </Descriptions.Item>
            <Descriptions.Item label="CEP">
              {mockDadosEmpresa.cep}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
};

export default DadosEmpresaPage;
