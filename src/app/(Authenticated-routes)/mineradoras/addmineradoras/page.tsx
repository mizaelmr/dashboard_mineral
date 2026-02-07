"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, message } from "antd";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";
import { getAllProcesses, createMiningSite } from "../actions";
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

const AddMineradorasPage: React.FC = () => {
  const router = useRouter();
  const [processosOptions, setProcessosOptions] = useState<SelectOption[]>([]);
  const [loadingProcesses, setLoadingProcesses] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<MineradoraFormValues>({
    defaultValues: {
      processo: "",
      nome: "",
      numeroConcessao: "",
      observacao: "",
    },
  });

  useEffect(() => {
    getAllProcesses()
      .then((processes) => {
        setProcessosOptions(
          processes.map((p) => ({
            value: String(p.id),
            label: p.number ?? String(p.id),
          }))
        );
      })
      .catch(() => {
        message.error("Falha ao carregar processos.");
      })
      .finally(() => {
        setLoadingProcesses(false);
      });
  }, []);

  const onSubmit = async (data: MineradoraFormValues) => {
    setSubmitting(true);
    try {
      await createMiningSite({
        processId: Number(data.processo),
        name: cleanLowerValue(data.nome) ?? "",
        concessionNumber: cleanLowerValue(data.numeroConcessao) ?? undefined,
        observation:
          data.observacao?.trim() === "" ? undefined : data.observacao?.trim(),
      });
      message.success("Mineradora cadastrada com sucesso.");
      router.push("/mineradoras");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao cadastrar mineradora."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Nova Mineradora
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
              loading={loadingProcesses}
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

        <Button type="primary" htmlType="submit" loading={submitting}>
          Salvar
        </Button>
      </form>
    </div>
  );
};

export default AddMineradorasPage;
