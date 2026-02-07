"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, message } from "antd";
import { HookFormInput } from "@/components/hook-forms";
import { getLicenseById, updateLicense } from "../../actions";
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

const EditLicencaPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<LicencaFormValues>({
    defaultValues: {
      nome: "",
      codigo: "",
      orgao: "",
    },
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getLicenseById(Number(id))
      .then((license) => {
        if (cancelled || !license) return;
        reset({
          nome: license.name ?? "",
          codigo: license.code ?? "",
          orgao: license.authority ?? "",
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, reset]);

  const onSubmit = async (data: LicencaFormValues) => {
    try {
      await updateLicense(Number(id), {
        name: cleanLowerValue(data.nome) ?? "",
        code: cleanLowerValue(data.codigo) ?? undefined,
        authority: cleanLowerValue(data.orgao) ?? undefined,
      });
      message.success("Licença atualizada com sucesso.");
      router.push("/licencas");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao atualizar licença."
      );
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Editar Licença
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
              placeholder="Digite o nome da licença"
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

        <Button type="primary" htmlType="submit">
          Atualizar
        </Button>
      </form>
    </div>
  );
};

export default EditLicencaPage;
