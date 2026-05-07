"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, message } from "antd";
import { HookFormInput } from "@/components/hook-forms";
import { getProcessById, updateProcess } from "../../actions";
import { cleanLowerValue } from "@/utils/cleanLowerValue";

interface ProcessoFormValues {
  nome: string;
  numero: string;
  hectares: string;
  observacao: string;
}

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

const inputFullStyle: React.CSSProperties = { width: "100%" };

function parseHectares(value: string): number | string | undefined {
  if (value == null || value.trim() === "") return undefined;
  const normalized = value.trim().replace(",", ".");
  const num = parseFloat(normalized);
  if (!Number.isNaN(num)) return num;
  return normalized;
}

const EditProcessoPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<ProcessoFormValues>({
    defaultValues: {
      nome: "",
      numero: "",
      hectares: "",
      observacao: "",
    },
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getProcessById(Number(id))
      .then((process) => {
        if (cancelled || !process) return;
        reset({
          nome: process.name ?? "",
          numero: process.number ?? "",
          hectares: process.hectares ?? "",
          observacao: process.observation ?? "",
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, reset]);

  const onSubmit = async (data: ProcessoFormValues) => {
    try {
      await updateProcess(Number(id), {
        number: cleanLowerValue(data.numero) ?? "",
        name: cleanLowerValue(data.nome) ?? undefined,
        hectares: parseHectares(data.hectares),
        observation:
          data.observacao?.trim() === "" ? undefined : data.observacao?.trim(),
      });
      message.success("Processo atualizado com sucesso.");
      router.push("/processos");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao atualizar processo."
      );
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Editar Processo
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
              label="Nome:"
              placeholder="Digite nome do processo"
              style={inputFullStyle}
            />
          </div>
          <div style={gridRow2Style}>
            <HookFormInput
              name="numero"
              control={control}
              label="*Número:"
              placeholder="000.000/0000"
              rules={{ required: "Número é obrigatório" }}
              style={inputFullStyle}
            />
            <HookFormInput
              name="hectares"
              control={control}
              label="*Hectares:"
              placeholder="Digite os hectares"
              rules={{ required: "Hectares é obrigatório" }}
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="observacao"
              control={control}
              label="Observação:"
              placeholder="Digite observação"
              style={inputFullStyle}
            />
          </div>
        </section>

        <Button type="primary" htmlType="submit">
          Atualizar
        </Button>
      </form>
    </div>
  );
};

export default EditProcessoPage;
