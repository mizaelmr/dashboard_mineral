"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { HookFormInput } from "@/components/hook-forms";

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

const AddProcessosPage: React.FC = () => {
  const { control, handleSubmit } = useForm<ProcessoFormValues>({
    defaultValues: {
      nome: "",
      numero: "",
      hectares: "",
      observacao: "",
    },
  });

  const onSubmit = (data: ProcessoFormValues) => {
    console.log("Salvar processo:", data);
    // Implementar lógica de persistência
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Processo
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Novo
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

export default AddProcessosPage;
