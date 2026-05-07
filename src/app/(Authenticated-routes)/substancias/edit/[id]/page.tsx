"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, message } from "antd";
import { HookFormInput } from "@/components/hook-forms";
import { getSubstanceById, updateSubstance } from "../../actions";
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

const EditSubstanciaPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<SubstanciaFormValues>({
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getSubstanceById(Number(id))
      .then((substance) => {
        if (cancelled || !substance) return;
        reset({
          nome: substance.name ?? "",
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, reset]);

  const onSubmit = async (data: SubstanciaFormValues) => {
    try {
      await updateSubstance(Number(id), {
        name: cleanLowerValue(data.nome) ?? "",
      });
      message.success("Substância atualizada com sucesso.");
      router.push("/substancias");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao atualizar substância."
      );
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Editar Substância
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

        <Button type="primary" htmlType="submit">
          Atualizar
        </Button>
      </form>
    </div>
  );
};

export default EditSubstanciaPage;
