"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";

interface CertificadoFormValues {
  cliente: string;
  declarante: string;
  mineradora: string;
  substancia: string;
  unidadeMedida: string;
  categoria: string;
  peso: string;
  valorPorPeso: string;
  valorTotal: string;
  descricao: string;
  informacoesAdicionais: string;
  descricaoImagem: string;
}

// Dados de exemplo para selects
const clientesOptions: SelectOption[] = [
  { value: "1", label: "PR ATIVOS AMBIENTAIS E ENERGIAS RENOVAVEIS LTDA" },
  { value: "2", label: "TIME INVEST ADMINISTRAÇÃO E PARTICIPAÇÕES EIRELI-ME" },
];

const declarantesOptions: SelectOption[] = [
  { value: "1", label: "ALESSANDRO MONTEIRO DA SILVA" },
  { value: "2", label: "Carlos Mendes" },
];

const mineradorasOptions: SelectOption[] = [
  { value: "1", label: "MINAS DIVERSAS (871.861/2006)" },
  { value: "2", label: "MINAS DIVERSAS (871.860/2006)" },
];

const substanciasOptions: SelectOption[] = [
  { value: "1", label: "ESMERALDA" },
  { value: "2", label: "ALEXANDRITA" },
  { value: "3", label: "MOLIBDENIO" },
];

const unidadesMedidaOptions: SelectOption[] = [
  { value: "kg", label: "Kg" },
  { value: "g", label: "g" },
  { value: "t", label: "t" },
];

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const gridRow2Style: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  marginBottom: 16,
};

const gridRow3Style: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 16,
  marginBottom: 16,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const AddCertificadosPage: React.FC = () => {
  const { control, handleSubmit } = useForm<CertificadoFormValues>({
    defaultValues: {
      cliente: "",
      declarante: "",
      mineradora: "",
      substancia: "",
      unidadeMedida: "",
      categoria: "",
      peso: "0,00000",
      valorPorPeso: "0,0000",
      valorTotal: "0.00",
      descricao: "",
      informacoesAdicionais: "",
      descricaoImagem: "",
    },
  });

  const onSubmit = (data: CertificadoFormValues) => {
    console.log("Salvar certificado:", data);
    // Implementar lógica de persistência
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Cadastro de Certificado
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Cadastro de certificado de origem
          </h2>
          
          <div style={gridRow2Style}>
            <HookFormSelect
              name="cliente"
              control={control}
              label="*Cliente:"
              options={clientesOptions}
              placeholder="Selecione um Cliente"
              rules={{ required: "Cliente é obrigatório" }}
              style={inputFullStyle}
            />
            <HookFormSelect
              name="declarante"
              control={control}
              label="Declarante:"
              options={declarantesOptions}
              placeholder="Selecione um Declarante"
              style={inputFullStyle}
            />
          </div>

          <div style={gridRow3Style}>
            <HookFormSelect
              name="mineradora"
              control={control}
              label="*Mineradora:"
              options={mineradorasOptions}
              placeholder="Selecione uma Mineradora"
              rules={{ required: "Mineradora é obrigatória" }}
              style={inputFullStyle}
            />
            <HookFormSelect
              name="substancia"
              control={control}
              label="*Substância:"
              options={substanciasOptions}
              placeholder="selecione"
              rules={{ required: "Substância é obrigatória" }}
              style={inputFullStyle}
            />
            <HookFormSelect
              name="unidadeMedida"
              control={control}
              label="*Unidade de Medida:"
              options={unidadesMedidaOptions}
              placeholder="Selecione uma Unidade"
              rules={{ required: "Unidade de Medida é obrigatória" }}
              style={inputFullStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="categoria"
              control={control}
              label="*Categoria:"
              placeholder="Digite a categoria do produto"
              rules={{ required: "Categoria é obrigatória" }}
              style={inputFullStyle}
            />
          </div>

          <div style={gridRow3Style}>
            <HookFormInput
              name="peso"
              control={control}
              label="*Peso (Kg):"
              placeholder="0,00000"
              rules={{ required: "Peso é obrigatório" }}
              style={inputFullStyle}
            />
            <HookFormInput
              name="valorPorPeso"
              control={control}
              label="*Valor por peso (R$/Kg):"
              placeholder="0,0000"
              rules={{ required: "Valor por peso é obrigatório" }}
              style={inputFullStyle}
            />
            <HookFormInput
              name="valorTotal"
              control={control}
              label="*Valor total (R$):"
              placeholder="0.00"
              rules={{ required: "Valor total é obrigatório" }}
              style={inputFullStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Controller
              name="descricao"
              control={control}
              rules={{ required: "Descrição é obrigatória" }}
              render={({ field, fieldState }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>
                    *Descrição:
                  </label>
                  <Input.TextArea
                    {...field}
                    placeholder="Digite uma descrição para o produto"
                    rows={4}
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
          </div>

          <div style={{ marginBottom: 16 }}>
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
                    placeholder="Observação"
                    rows={4}
                  />
                </div>
              )}
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Imagens:
          </h3>
          <div style={{ marginBottom: 16 }}>
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
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="descricaoImagem"
              control={control}
              label="Descrição da imagem:"
              placeholder="Descrição para imagem (opcional)"
              style={inputFullStyle}
            />
          </div>
        </section>

        <Button
          type="primary"
          htmlType="submit"
        >
          Salvar
        </Button>
      </form>
    </div>
  );
};

export default AddCertificadosPage;
