"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { HookFormInput } from "@/components/hook-forms";

interface SubstanciaFormValues {
  nomeSubstancia: string;
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const AddSubstanciasPage: React.FC = () => {
  const { control, handleSubmit } = useForm<SubstanciaFormValues>({
    defaultValues: {
      nomeSubstancia: "",
    },
  });

  const onSubmit = (data: SubstanciaFormValues) => {
    console.log("Salvar substância:", data);
    // Implementar lógica de persistência
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Nova Substância
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <HookFormInput
            name="nomeSubstancia"
            control={control}
            label="Nome da Substância:"
            placeholder="Digite o nome... Exemplo: Esmeralda, Alexandrita"
            style={inputFullStyle}
          />
        </section>

        <Button
          type="primary"
          htmlType="submit"
        >
          salvar
        </Button>
      </form>
    </div>
  );
};

export default AddSubstanciasPage;
