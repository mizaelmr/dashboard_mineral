"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";

interface ClienteFormValues {
  nome: string;
  cpf: string;
  razaoSocial: string;
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

// Função para mapear Cliente para ClienteFormValues
const mapClienteToFormValues = (cliente: Cliente): ClienteFormValues => {
  // Verificar se cpfCnpj é CPF ou CNPJ baseado na presença de "/"
  const isCNPJ = cliente.cpfCnpj.includes("/");
  
  return {
    nome: cliente.nome || "",
    cpf: isCNPJ ? "" : cliente.cpfCnpj || "",
    razaoSocial: isCNPJ ? cliente.nome : "",
    cnpj: isCNPJ ? cliente.cpfCnpj : "",
    cep: "",
    endereco: "",
    complemento: "",
    bairro: "",
    numero: "",
    cidade: cliente.cidade || "",
    estado: cliente.estado || "",
    cel: cliente.telefone || "",
    tel: "",
    email: cliente.email || "",
  };
};

const EditClientePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<ClienteFormValues>({
    defaultValues: {
      nome: "",
      cpf: "",
      razaoSocial: "",
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
    // Simular busca de dados do cliente
    const fetchClienteData = () => {
      setLoading(true);
      
      // Buscar cliente do array de exemplo
      const cliente = mockClientes.find((c) => c.id === id);
      
      if (cliente) {
        // Mapear dados do cliente para o formato do formulário
        const formData = mapClienteToFormValues(cliente);
        // Resetar formulário com os dados do cliente
        reset(formData);
      }
      
      setLoading(false);
    };

    if (id) {
      fetchClienteData();
    }
  }, [id, reset]);

  const onSubmit = (data: ClienteFormValues) => {
    console.log("Atualizar cliente:", { id, ...data });
    // Implementar lógica de atualização
    // Após salvar, redirecionar para lista de clientes
    router.push("/clientes");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Editar Cliente
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Seção Dados */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Dados
          </h2>
          <div style={gridRow2Style}>
            <HookFormInput
              name="nome"
              control={control}
              label="*Nome:"
              placeholder="Digite o nome do cliente"
              rules={{ required: "Nome é obrigatório" }}
              style={inputFullStyle}
            />
            <HookFormInput
              name="cpf"
              control={control}
              label="CPF:"
              placeholder="000.000.000-00"
              style={inputFullStyle}
            />
          </div>
          <div style={gridRow2Style}>
            <HookFormInput
              name="razaoSocial"
              control={control}
              label="Razão Social:"
              placeholder="Digite a Razão Social do cliente"
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

export default EditClientePage;
