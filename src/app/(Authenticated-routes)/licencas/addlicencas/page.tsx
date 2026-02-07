"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, message } from "antd";
import { HookFormInput } from "@/components/hook-forms";
import { createLicense } from "../actions";
import { cleanLowerValue } from "@/utils/cleanLowerValue";

interface LicencaFormValues {
  nome: string;
  codigo: string;
  orgao: string;
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const AddLicencasPage: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<LicencaFormValues>({
    defaultValues: {
      nome: "",
      codigo: "",
      orgao: "",
    },
  });

  const onSubmit = async (data: LicencaFormValues) => {
    setSubmitting(true);
    try {
      await createLicense({
        name: cleanLowerValue(data.nome) ?? "",
        code: cleanLowerValue(data.codigo) ?? undefined,
        authority: cleanLowerValue(data.orgao) ?? undefined,
      });
      message.success("Licença cadastrada com sucesso.");
      router.push("/licencas");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao cadastrar licença."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Nova Licença
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
              label="*Nome:"
              placeholder="Digite o nome da licença (ex.: licença ambiental)"
              rules={{ required: "Nome é obrigatório" }}
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="codigo"
              control={control}
              label="Código:"
              placeholder="Digite o código"
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="orgao"
              control={control}
              label="Órgão:"
              placeholder="Digite o órgão emissor"
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

export default AddLicencasPage;
