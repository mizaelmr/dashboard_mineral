"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, message } from "antd";
import { HookFormInput } from "@/components/hook-forms";
import { createSubstance } from "../actions";
import { cleanLowerValue } from "@/utils/cleanLowerValue";

interface SubstanciaFormValues {
  nome: string;
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const AddSubstanciasPage: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<SubstanciaFormValues>({
    defaultValues: {
      nome: "",
    },
  });

  const onSubmit = async (data: SubstanciaFormValues) => {
    setSubmitting(true);
    try {
      await createSubstance({
        name: cleanLowerValue(data.nome) ?? "",
      });
      message.success("Substância cadastrada com sucesso.");
      router.push("/substancias");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao cadastrar substância."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Nova Substância
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
              label="*Nome da Substância:"
              placeholder="Digite o nome... Exemplo: Esmeralda, Alexandrita"
              rules={{ required: "Nome é obrigatório" }}
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

export default AddSubstanciasPage;
