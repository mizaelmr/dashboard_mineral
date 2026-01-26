"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, message, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";
import { getClientById, updateClient } from "../../actions";
import {
  mapClientToFormValues,
  mapFormValuesToUpdateDto,
} from "@/types/client";
import { clienteFormSchema, ClienteFormSchema } from "@/schemas/client.schema";

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

const EditClientePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<ClienteFormSchema>({
    resolver: zodResolver(clienteFormSchema),
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
    const fetchClienteData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const client = await getClientById(Number(id));
        const formData = mapClientToFormValues(client) as ClienteFormSchema;
        reset(formData);
      } catch (error) {
        message.error(
          error instanceof Error ? error.message : "Failed to load client"
        );
        router.push("/clientes");
      } finally {
        setLoading(false);
      }
    };

    fetchClienteData();
  }, [id, reset, router]);

  const handleBack = () => router.push("/clientes");
  const handleCancel = () => router.push("/clientes");

  const onSubmit = async (data: ClienteFormSchema) => {
    if (!id) {
      return;
    }

    setSubmitting(true);
    try {
      const updateDto = mapFormValuesToUpdateDto(data);
      await updateClient(Number(id), updateDto);
      message.success("Client updated successfully");
      router.push("/clientes");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to update client"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              type="default"
              htmlType="button"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
            >
              Voltar
            </Button>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
              Editar Cliente
            </h1>
          </div>
          <Space size="middle">
            <Button type="default" htmlType="button" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Atualizar
            </Button>
          </Space>
        </div>
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
      </form>
    </div>
  );
};

export default EditClientePage;
