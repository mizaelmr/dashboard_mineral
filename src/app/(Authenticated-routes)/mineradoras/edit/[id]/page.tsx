"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, message } from "antd";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";
import { getMiningSiteById, getAllProcesses, updateMiningSite } from "../../actions";
import { cleanLowerValue } from "@/utils/cleanLowerValue";

interface MineradoraFormValues {
  processo: string;
  nome: string;
  numeroConcessao: string;
  observacao: string;
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const EditMineradoraPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [processosOptions, setProcessosOptions] = useState<SelectOption[]>([]);

  const { control, handleSubmit, reset } = useForm<MineradoraFormValues>({
    defaultValues: {
      processo: "",
      nome: "",
      numeroConcessao: "",
      observacao: "",
    },
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getMiningSiteById(Number(id)), getAllProcesses()])
      .then(([site, processes]) => {
        if (cancelled) return;
        setProcessosOptions(
          processes.map((p) => ({
            value: String(p.id),
            label: p.number ?? String(p.id),
          }))
        );
        if (site) {
          reset({
            processo: site.processId != null ? String(site.processId) : "",
            nome: site.name ?? "",
            numeroConcessao: site.concessionNumber ?? "",
            observacao: site.observation ?? "",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, reset]);

  const onSubmit = async (data: MineradoraFormValues) => {
    try {
      const concessionNumberValue = data.numeroConcessao?.trim();
      await updateMiningSite(Number(id), {
        processId: Number(data.processo),
        name: cleanLowerValue(data.nome) ?? "",
        concessionNumber: concessionNumberValue
          ? (cleanLowerValue(data.numeroConcessao) ?? undefined)
          : null,
        observation:
          data.observacao?.trim() === "" ? undefined : data.observacao?.trim(),
      });
      message.success("Mineradora atualizada com sucesso.");
      router.push("/mineradoras");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao atualizar mineradora."
      );
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Editar Mineradora
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Dados
          </h2>
          <div style={{ marginBottom: 16 }}>
            <HookFormSelect
              name="processo"
              control={control}
              label="*Processo:"
              options={processosOptions}
              placeholder="Selecione um Processo"
              rules={{ required: "Processo é obrigatório" }}
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="nome"
              control={control}
              label="*Nome:"
              placeholder="Digite nome da mineradora"
              rules={{ required: "Nome é obrigatório" }}
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="numeroConcessao"
              control={control}
              label="Número de concessão:"
              placeholder="Digite número de concessão"
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

export default EditMineradoraPage;
