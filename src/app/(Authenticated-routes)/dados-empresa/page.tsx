"use client";

import React, { useState } from "react";
import { Card, Button, Descriptions, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";

const DadosEmpresaPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    console.log("Editar dados da empresa");
    // Implementar lógica de edição
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
          style={{
            backgroundColor: "#13c2c2",
            borderColor: "#13c2c2",
          }}
        >
          Editar
        </Button>
      </div>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Seção Dados */}
        <Card title="Dados" style={{ width: "100%" }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Nome">
              COOPERATIVA MINERAL DA BAHIA
            </Descriptions.Item>
            <Descriptions.Item label="Razão Social">
              COOPERATIVA MINERAL DA BAHIA - CMB
            </Descriptions.Item>
            <Descriptions.Item label="CNPJ">
              08.020.967/0001-47
            </Descriptions.Item>
            <Descriptions.Item label="IE">
              69.031.374-NO
            </Descriptions.Item>
            <Descriptions.Item label="Fone 1">
              (74) 99961-1561
            </Descriptions.Item>
            <Descriptions.Item label="Fone 2">
              {""}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail">
              ----------
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Seção Localização */}
        <Card title="Localização" style={{ width: "100%" }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Endereço">
              RUA PETROLINA
            </Descriptions.Item>
            <Descriptions.Item label="Número">
              215
            </Descriptions.Item>
            <Descriptions.Item label="Bairro">
              SERRA DA CARNAIBA - PINDOBAÇU - BA
            </Descriptions.Item>
            <Descriptions.Item label="CEP">
              44770-000
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
};

export default DadosEmpresaPage;
