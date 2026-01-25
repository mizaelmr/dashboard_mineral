"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";

interface DeclaranteFormValues {
  cpf: string;
  nomeEmpresa: string;
  nome: string;
  cnpj: string;
  cep: string;
  endereco: string;
  complemento: string;
  bairro: string;
  numero: string;
  cidade: string;
  estado: string;
  cel: string;
  tel: string;
  email: string;
}

const UFS: SelectOption[] = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
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

const AddDeclarantesPage: React.FC = () => {
  const { control, handleSubmit } = useForm<DeclaranteFormValues>({
    defaultValues: {
      cpf: "",
      nomeEmpresa: "",
      nome: "",
      cnpj: "",
      cep: "",
      endereco: "",
      complemento: "",
      bairro: "",
      numero: "",
      cidade: "",
      estado: "",
      cel: "",
      tel: "",
      email: "",
    },
  });

  const onSubmit = (data: DeclaranteFormValues) => {
    console.log("Salvar declarante:", data);
    // Implementar lógica de persistência
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Novo Declarante
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Seção Dados */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Dados
          </h2>
          <div style={gridRow2Style}>
            <HookFormInput
              name="cpf"
              control={control}
              label="*CPF:"
              placeholder="000.000.000-00"
              rules={{ required: "CPF é obrigatório" }}
              style={inputFullStyle}
            />
            <HookFormInput
              name="nome"
              control={control}
              label="*Nome:"
              placeholder="Digite o nome do declarante"
              rules={{ required: "Nome é obrigatório" }}
              style={inputFullStyle}
            />
          </div>
          <div style={gridRow2Style}>
            <HookFormInput
              name="nomeEmpresa"
              control={control}
              label="Nome da empresa:"
              placeholder="Digite o nome da empresa"
              style={inputFullStyle}
            />
            <HookFormInput
              name="cnpj"
              control={control}
              label="CNPJ:"
              placeholder="00.000.000/0000-00"
              style={inputFullStyle}
            />
          </div>
        </section>

        {/* Seção Endereço */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Endereço
          </h2>
          <div style={gridRow2Style}>
            <HookFormInput
              name="cep"
              control={control}
              label="CEP:"
              placeholder="00000-000"
              style={inputFullStyle}
            />
            <HookFormInput
              name="endereco"
              control={control}
              label="Endereço:"
              placeholder="Nada informado"
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="complemento"
              control={control}
              label="Complemento:"
              placeholder="Nada informado"
              style={inputFullStyle}
            />
          </div>
          <div style={gridRow2Style}>
            <HookFormInput
              name="bairro"
              control={control}
              label="Bairro:"
              placeholder="Nada informado"
              style={inputFullStyle}
            />
            <HookFormInput
              name="numero"
              control={control}
              label="Número:"
              placeholder="00000"
              style={inputFullStyle}
            />
          </div>
          <div style={gridRow2Style}>
            <HookFormInput
              name="cidade"
              control={control}
              label="Cidade:"
              placeholder="Nada informado"
              style={inputFullStyle}
            />
            <HookFormSelect
              name="estado"
              control={control}
              label="Estado:"
              options={UFS}
              placeholder="Selecione uma opção"
              style={inputFullStyle}
            />
          </div>
        </section>

        {/* Seção Contatos */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Contatos
          </h2>
          <div style={gridRow3Style}>
            <HookFormInput
              name="cel"
              control={control}
              label="Cel:"
              placeholder="(00) 90000-0000"
              style={inputFullStyle}
            />
            <HookFormInput
              name="tel"
              control={control}
              label="Tel:"
              placeholder="(00) 0000-0000"
              style={inputFullStyle}
            />
            <HookFormInput
              name="email"
              control={control}
              label="E-mail:"
              placeholder="mail@mail.com"
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

export default AddDeclarantesPage;
