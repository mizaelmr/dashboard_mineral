"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { HookFormInput } from "@/components/hook-forms";

interface SubstanciaFormValues {
  nomeSubstancia: string;
}

interface Substancia {
  key: string;
  id: string;
  nome: string;
}

// Dados de exemplo (mesmos da lista de substâncias)
const mockSubstancias: Substancia[] = [
  {
    key: "1",
    id: "1",
    nome: "ESMERALDA",
  },
  {
    key: "2",
    id: "2",
    nome: "ALEXANDRITA",
  },
  {
    key: "3",
    id: "3",
    nome: "MOLIBDENIO",
  },
  {
    key: "4",
    id: "4",
    nome: "QUARTZO",
  },
];

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

// Função para mapear Substancia para SubstanciaFormValues
const mapSubstanciaToFormValues = (substancia: Substancia): SubstanciaFormValues => {
  return {
    nomeSubstancia: substancia.nome || "",
  };
};

const EditSubstanciaPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<SubstanciaFormValues>({
    defaultValues: {
      nomeSubstancia: "",
    },
  });

  useEffect(() => {
    // Simular busca de dados da substância
    const fetchSubstanciaData = () => {
      setLoading(true);
      
      // Buscar substância do array de exemplo
      const substancia = mockSubstancias.find((s) => s.id === id);
      
      if (substancia) {
        // Mapear dados da substância para o formato do formulário
        const formData = mapSubstanciaToFormValues(substancia);
        // Resetar formulário com os dados da substância
        reset(formData);
      }
      
      setLoading(false);
    };

    if (id) {
      fetchSubstanciaData();
    }
  }, [id, reset]);

  const onSubmit = (data: SubstanciaFormValues) => {
    console.log("Atualizar substância:", { id, ...data });
    // Implementar lógica de atualização
    // Após salvar, redirecionar para lista de substâncias
    router.push("/substancias");
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
          Atualizar
        </Button>
      </form>
    </div>
  );
};

export default EditSubstanciaPage;
