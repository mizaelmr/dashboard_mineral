"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface Declarante {
  key: string;
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  tipo: "físico" | "jurídico";
  status: "ativo" | "inativo";
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

// Dados de exemplo (mesmos da lista de declarantes)
const mockDeclarantes: Declarante[] = [
  {
    key: "1",
    id: "1",
    nome: "Carlos Mendes",
    cpf: "123.456.789-00",
    email: "carlos.mendes@email.com",
    telefone: "(71) 99999-9999",
    cidade: "Salvador",
    estado: "BA",
    tipo: "físico",
    status: "ativo",
  },
  {
    key: "2",
    id: "2",
    nome: "Fernanda Lima",
    cpf: "987.654.321-00",
    email: "fernanda.lima@email.com",
    telefone: "(71) 88888-8888",
    cidade: "Feira de Santana",
    estado: "BA",
    tipo: "físico",
    status: "ativo",
  },
  {
    key: "3",
    id: "3",
    nome: "Mineração Bahia S.A.",
    cpf: "12.345.678/0001-90",
    email: "contato@mineracaobahia.com.br",
    telefone: "(71) 77777-7777",
    cidade: "Vitória da Conquista",
    estado: "BA",
    tipo: "jurídico",
    status: "ativo",
  },
  {
    key: "4",
    id: "4",
    nome: "Roberto Alves",
    cpf: "111.222.333-44",
    email: "roberto.alves@email.com",
    telefone: "(71) 66666-6666",
    cidade: "Ilhéus",
    estado: "BA",
    tipo: "físico",
    status: "inativo",
  },
  {
    key: "5",
    id: "5",
    nome: "Juliana Rocha",
    cpf: "555.666.777-88",
    email: "juliana.rocha@email.com",
    telefone: "(71) 55555-5555",
    cidade: "Juazeiro",
    estado: "BA",
    tipo: "físico",
    status: "ativo",
  },
  {
    key: "6",
    id: "6",
    nome: "Extração Mineral LTDA",
    cpf: "98.765.432/0001-10",
    email: "contato@extracaomineral.com.br",
    telefone: "(71) 44444-4444",
    cidade: "Camaçari",
    estado: "BA",
    tipo: "jurídico",
    status: "ativo",
  },
];

// Função para mapear Declarante para DeclaranteFormValues
const mapDeclaranteToFormValues = (declarante: Declarante): DeclaranteFormValues => {
  const isJuridico = declarante.tipo === "jurídico";
  const isCNPJ = declarante.cpf.includes("/");
  
  return {
    cpf: isJuridico ? "" : declarante.cpf || "",
    nomeEmpresa: isJuridico ? declarante.nome : "",
    nome: declarante.nome || "",
    cnpj: isJuridico ? declarante.cpf : "",
    cep: "",
    endereco: "",
    complemento: "",
    bairro: "",
    numero: "",
    cidade: declarante.cidade || "",
    estado: declarante.estado || "",
    cel: declarante.telefone || "",
    tel: "",
    email: declarante.email || "",
  };
};

const EditDeclarantePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<DeclaranteFormValues>({
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

  useEffect(() => {
    // Simular busca de dados do declarante
    const fetchDeclaranteData = () => {
      setLoading(true);
      
      // Buscar declarante do array de exemplo
      const declarante = mockDeclarantes.find((d) => d.id === id);
      
      if (declarante) {
        // Mapear dados do declarante para o formato do formulário
        const formData = mapDeclaranteToFormValues(declarante);
        // Resetar formulário com os dados do declarante
        reset(formData);
      }
      
      setLoading(false);
    };

    if (id) {
      fetchDeclaranteData();
    }
  }, [id, reset]);

  const onSubmit = (data: DeclaranteFormValues) => {
    console.log("Atualizar declarante:", { id, ...data });
    // Implementar lógica de atualização
    // Após salvar, redirecionar para lista de declarantes
    router.push("/declarantes");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Editar Declarante
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
          Atualizar
        </Button>
      </form>
    </div>
  );
};

export default EditDeclarantePage;
