"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { HookFormInput } from "@/components/hook-forms";

interface LicencaFormValues {
  licencaAmbiental: string;
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const AddLicencasPage: React.FC = () => {
  const { control, handleSubmit } = useForm<LicencaFormValues>({
    defaultValues: {
      licencaAmbiental: "",
    },
  });

  const onSubmit = (data: LicencaFormValues) => {
    console.log("Salvar licença:", data);
    // Implementar lógica de persistência
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Nova Licença
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <HookFormInput
            name="licencaAmbiental"
            control={control}
            label="Licença Ambiental:"
            placeholder="Digite a licença ambiental"
            style={inputFullStyle}
          />
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

export default AddLicencasPage;
