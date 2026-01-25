"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Upload, Space, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";

interface CertificadoFormValues {
  // Informações da Cooperativa
  cnpjCooperativa: string;
  ieCooperativa: string;
  enderecoCooperativa: string;
  telefoneCooperativa: string;
  codigoVerificacao: string;
  
  // Informações do Declarante/Cliente
  nomeCliente: string;
  razaoSocial: string;
  cnpjCliente: string;
  contatoCliente: string;
  
  // Informações de Endereço e Processo
  enderecoCliente: string;
  processoANM: string;
  mineracao: string;
  area: string;
  
  // Informações do Certificado
  processosDNPM: string[];
  licencaAmbiental: string;
  dataLicenca: string;
  
  // Informações da Licença
  descricaoCaracterizacao: string;
  tipo: string;
  peso: string;
  informacoesAdicionais: string;
}

interface Certificado {
  key: string;
  id: string;
  cliente: string;
  descricao: string;
  dataGerada: string;
  valor: string;
}

// Dados de exemplo para selects
const processosOptions: SelectOption[] = [
  { value: "871.860/2006", label: "871.860/2006" },
  { value: "871.861/2006", label: "871.861/2006" },
  { value: "873.335/2006", label: "873.335/2006" },
];

const licencasOptions: SelectOption[] = [
  { value: "INEMA 499 D.O.E", label: "INEMA 499 D.O.E" },
  { value: "INEMA 500 D.O.E", label: "INEMA 500 D.O.E" },
];

// Dados de exemplo (mesmos da lista de certificados)
const mockCertificados: Certificado[] = [
  {
    key: "1",
    id: "3186",
    cliente: "TIME INVEST ADMINISTRAÇÃO E PARTICIPAÇÕES EIRELI-ME",
    descricao: "CANGA DE ESMERALDA",
    dataGerada: "2026-01-21 15:48:37",
    valor: "R$ 6.000,00",
  },
  {
    key: "2",
    id: "3185",
    cliente: "YUSO ANTÔNIO VIEIRA COSTA",
    descricao: "ESMERALDA BRUTA",
    dataGerada: "2026-01-15 14:05:11",
    valor: "R$ 1.260,00",
  },
  {
    key: "3",
    id: "3184",
    cliente: "RICARDO NAZARENO CAMPELO SIQUEIRA",
    descricao: "ESMERALDA BRUTA",
    dataGerada: "2026-01-14 14:31:35",
    valor: "R$ 1.000,00",
  },
  {
    key: "4",
    id: "3183",
    cliente: "LEONARDO DA SILVA GOMES",
    descricao: "ESMERALDA BRUTA",
    dataGerada: "2026-01-14 14:07:51",
    valor: "R$ 496,00",
  },
];

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const gridRow3Style: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 16,
  marginBottom: 16,
};

const gridRow2Style: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  marginBottom: 16,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const emptySpaceStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 150,
  border: "1px solid #d9d9d9",
  borderRadius: 4,
  backgroundColor: "#fafafa",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// Função para mapear Certificado para CertificadoFormValues
const mapCertificadoToFormValues = (certificado: Certificado): CertificadoFormValues => {
  return {
    cnpjCooperativa: "08.020.967/0001-47",
    ieCooperativa: "69.031.374-NO",
    enderecoCooperativa: "RUA PETROLINA, 215, SERRA DA CARNAIBA - PINDOBAÇU - BA Pindobaçu / BA - 44770-000",
    telefoneCooperativa: "(74) 99961-1561",
    codigoVerificacao: "697234fb70bb4",
    nomeCliente: certificado.cliente || "",
    razaoSocial: "PR BUSINESS",
    cnpjCliente: "08.600.789/0001-23",
    contatoCliente: "(77) 36127-021",
    enderecoCliente: "FAZENDA BANDEIRA, 254, Gilbués / PI 64930-000",
    processoANM: "871.860/2006",
    mineracao: "MINAS DIVERSAS (871.860/2006)",
    area: "894,00",
    processosDNPM: ["871.860/2006", "871.861/2006", "873.335/2006"],
    licencaAmbiental: "INEMA 499 D.O.E",
    dataLicenca: "01/07/2011",
    descricaoCaracterizacao: certificado.descricao || "",
    tipo: "C",
    peso: "3,46000",
    informacoesAdicionais: certificado.descricao || "",
  };
};

const EditCertificadoPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<CertificadoFormValues>({
    defaultValues: {
      cnpjCooperativa: "",
      ieCooperativa: "",
      enderecoCooperativa: "",
      telefoneCooperativa: "",
      codigoVerificacao: "",
      nomeCliente: "",
      razaoSocial: "",
      cnpjCliente: "",
      contatoCliente: "",
      enderecoCliente: "",
      processoANM: "",
      mineracao: "",
      area: "",
      processosDNPM: [],
      licencaAmbiental: "",
      dataLicenca: "",
      descricaoCaracterizacao: "",
      tipo: "",
      peso: "",
      informacoesAdicionais: "",
    },
  });

  useEffect(() => {
    const fetchCertificadoData = () => {
      setLoading(true);
      
      const certificado = mockCertificados.find((c) => c.id === id);
      
      if (certificado) {
        const formData = mapCertificadoToFormValues(certificado);
        reset(formData);
      }
      
      setLoading(false);
    };

    if (id) {
      fetchCertificadoData();
    }
  }, [id, reset]);

  const onSubmit = (data: CertificadoFormValues) => {
    console.log("Atualizar certificado:", { id, ...data });
    router.push("/certificados");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Editar Certificado
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            COOPERATIVA MINERAL DA BAHIA
          </h2>
          <div style={gridRow2Style}>
            <div>
              <HookFormInput
                name="cnpjCooperativa"
                control={control}
                label="CNPJ:"
                style={inputFullStyle}
              />
              <HookFormInput
                name="ieCooperativa"
                control={control}
                label="I.E:"
                style={inputFullStyle}
              />
            </div>
            <div>
              <HookFormInput
                name="enderecoCooperativa"
                control={control}
                label="Endereço:"
                style={inputFullStyle}
              />
              <HookFormInput
                name="telefoneCooperativa"
                control={control}
                label="Telefone:"
                style={inputFullStyle}
              />
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <HookFormInput
                name="codigoVerificacao"
                control={control}
                label="Código de Verificação:"
                style={inputFullStyle}
              />
            </div>
            <div style={{ width: 150, marginLeft: 16 }}>
              <label style={{ display: "block", marginBottom: 4 }}>QR Code:</label>
              <div style={emptySpaceStyle}>
              </div>
            </div>
          </div>
        </section>

        {/* Três Colunas - Informações Principais */}
        <section style={sectionStyle}>
          <div style={gridRow3Style}>
            {/* Coluna 1 - Informações do Cliente */}
            <div>
              <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 600 }}>
                NOME/NAME
              </h3>
              <HookFormInput
                name="nomeCliente"
                control={control}
                style={inputFullStyle}
              />
              <h3 style={{ margin: "16px 0 16px", fontSize: "14px", fontWeight: 600 }}>
                RAZÃO SOCIAL/SOCIAL REASON
              </h3>
              <HookFormInput
                name="razaoSocial"
                control={control}
                style={inputFullStyle}
              />
              <h3 style={{ margin: "16px 0 16px", fontSize: "14px", fontWeight: 600 }}>
                CNPJ
              </h3>
              <HookFormInput
                name="cnpjCliente"
                control={control}
                style={inputFullStyle}
              />
              <h3 style={{ margin: "16px 0 16px", fontSize: "14px", fontWeight: 600 }}>
                CONTATO/CONTACT
              </h3>
              <HookFormInput
                name="contatoCliente"
                control={control}
                style={inputFullStyle}
              />
            </div>

            {/* Coluna 2 - Endereço e Processo */}
            <div>
              <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 600 }}>
                ENDEREÇO/ADDRESS
              </h3>
              <HookFormInput
                name="enderecoCliente"
                control={control}
                style={inputFullStyle}
              />
              <h3 style={{ margin: "16px 0 16px", fontSize: "14px", fontWeight: 600 }}>
                PROCESSO/PROCESS ANM N°
              </h3>
              <HookFormInput
                name="processoANM"
                control={control}
                style={inputFullStyle}
              />
              <h3 style={{ margin: "16px 0 16px", fontSize: "14px", fontWeight: 600 }}>
                MINERAÇÃO/MINING
              </h3>
              <HookFormInput
                name="mineracao"
                control={control}
                style={inputFullStyle}
              />
              <h3 style={{ margin: "16px 0 16px", fontSize: "14px", fontWeight: 600 }}>
                ÁREA/AREA - ha
              </h3>
              <HookFormInput
                name="area"
                control={control}
                style={inputFullStyle}
              />
            </div>

            {/* Coluna 3 - Detalhes do Certificado */}
            <div>
              <h3 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 600 }}>
                Extração Mineral CERTIFICADO DE ORIGEM
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: "12px" }}>
                PLGs - Permissão de Lavra Garimpeira
              </p>
              <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 600 }}>
                Processos DNPM
              </h3>
              <Controller
                name="processosDNPM"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <Select
                      {...field}
                      mode="multiple"
                      options={processosOptions}
                      placeholder="Selecione os processos"
                      style={inputFullStyle}
                      status={fieldState.invalid ? "error" : undefined}
                    />
                    {fieldState.error?.message && (
                      <span style={{ fontSize: 12, color: "#ff4d4f", marginTop: 4, display: "block" }}>
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />
              <h3 style={{ margin: "16px 0 16px", fontSize: "14px", fontWeight: 600 }}>
                LICENÇA AMBIENTAL
              </h3>
              <HookFormSelect
                name="licencaAmbiental"
                control={control}
                options={licencasOptions}
                placeholder="Selecione a licença"
                style={inputFullStyle}
              />
              <HookFormInput
                name="dataLicenca"
                control={control}
                label="Data:"
                placeholder="DD/MM/AAAA"
                style={inputFullStyle}
              />
            </div>
          </div>
        </section>

        {/* Seção Licença */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Licença
          </h2>
          <div style={gridRow3Style}>
            <HookFormInput
              name="descricaoCaracterizacao"
              control={control}
              label="Descrição / Caracterização:"
              style={inputFullStyle}
            />
            <HookFormInput
              name="tipo"
              control={control}
              label="Tipo:"
              style={inputFullStyle}
            />
            <HookFormInput
              name="peso"
              control={control}
              label="Peso: Kg"
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <Controller
              name="informacoesAdicionais"
              control={control}
              render={({ field }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>
                    Informações adicionais:
                  </label>
                  <Input.TextArea
                    {...field}
                    rows={4}
                  />
                </div>
              )}
            />
          </div>
        </section>

        {/* Anexo */}
        <section style={sectionStyle}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Anexo
          </h3>
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </section>

        <Button
          type="primary"
          htmlType="submit"
        >
          Atualizar
        </Button>
      </form>
    </div>
  );
};

export default EditCertificadoPage;
