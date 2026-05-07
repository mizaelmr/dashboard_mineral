"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { HookFormInput } from "@/components/hook-forms";
import { mockDadosEmpresa, type DadosEmpresa } from "../page";

interface DadosEmpresaFormValues {
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

// Função para mapear DadosEmpresa para DadosEmpresaFormValues
const mapDadosEmpresaToFormValues = (dados: DadosEmpresa): DadosEmpresaFormValues => {
  return {
    nome: dados.nome || "",
    razaoSocial: dados.razaoSocial || "",
    cnpj: dados.cnpj || "",
    ie: dados.ie || "",
    cep: dados.cep || "",
    endereco: dados.endereco || "",
    bairro: dados.bairro || "",
    numero: dados.numero || "",
    complemento: dados.complemento || "",
    fone1: dados.fone1 || "",
    fone2: dados.fone2 || "",
    email: dados.email || "",
  };
};

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

const EditDadosEmpresaPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<DadosEmpresaFormValues>({
    defaultValues: {
      nome: "",
      razaoSocial: "",
      cnpj: "",
      ie: "",
      cep: "",
      endereco: "",
      bairro: "",
      numero: "",
      complemento: "",
      fone1: "",
      fone2: "",
      email: "",
    },
  });

  useEffect(() => {
    // Simular busca de dados da empresa
    const fetchDadosEmpresa = () => {
      setLoading(true);
      
      // Buscar dados (simulando busca de API)
      const dadosEmpresa = mockDadosEmpresa;
      
      if (dadosEmpresa) {
        // Mapear dados para o formato do formulário
        const formData = mapDadosEmpresaToFormValues(dadosEmpresa);
        // Resetar formulário com os dados
        reset(formData);
      }
      
      setLoading(false);
    };

    fetchDadosEmpresa();
  }, [reset]);

  const onSubmit = (data: DadosEmpresaFormValues) => {
    console.log("Salvar dados da empresa:", data);
    // Implementar lógica de persistência
    router.push("/dados-empresa");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Dados da Empresa
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Dados
          </h2>
          
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="nome"
              control={control}
              label="*Nome:"
              rules={{ required: "Nome é obrigatório" }}
              style={inputFullStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="razaoSocial"
              control={control}
              label="Razão Social:"
              style={inputFullStyle}
            />
          </div>

          <div style={gridRow2Style}>
            <HookFormInput
              name="cnpj"
              control={control}
              label="*CNPJ:"
              rules={{ required: "CNPJ é obrigatório" }}
              style={inputFullStyle}
            />
            <HookFormInput
              name="ie"
              control={control}
              label="IE:"
              style={inputFullStyle}
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Endereço
          </h2>
          
          <div style={{ marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <HookFormInput
              name="cep"
              control={control}
              label="*CEP:"
              rules={{ required: "CEP é obrigatório" }}
              style={inputFullStyle}
            />
            <div></div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="endereco"
              control={control}
              label="Endereço:"
              style={inputFullStyle}
            />
          </div>

          <div style={gridRow2Style}>
            <HookFormInput
              name="bairro"
              control={control}
              label="*Bairro:"
              rules={{ required: "Bairro é obrigatório" }}
              style={inputFullStyle}
            />
            <HookFormInput
              name="numero"
              control={control}
              label="Número:"
              style={inputFullStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="complemento"
              control={control}
              label="Complemento:"
              style={inputFullStyle}
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Contatos
          </h2>
          
          <div style={gridRow3Style}>
            <HookFormInput
              name="fone1"
              control={control}
              label="Fone 1:"
              style={inputFullStyle}
            />
            <HookFormInput
              name="fone2"
              control={control}
              label="Fone 2:"
              style={inputFullStyle}
            />
            <HookFormInput
              name="email"
              control={control}
              label="E-mail:"
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

export default EditDadosEmpresaPage;
