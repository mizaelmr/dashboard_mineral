"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { HookFormInput } from "@/components/hook-forms";

interface ProcessoFormValues {
  nome: string;
  numero: string;
  hectares: string;
  observacao: string;
}

interface Processo {
  key: string;
  id: string;
  nome: string;
  numero: string;
  hectares: string;
  observacao: string;
}

// Dados de exemplo (mesmos da lista de processos)
const mockProcessos: Processo[] = [
  {
    key: "1",
    id: "1",
    nome: "871.860/2006",
    numero: "871.860/2006",
    hectares: "894,00",
    observacao: "Não informado",
  },
  {
    key: "2",
    id: "2",
    nome: "871.861/2006",
    numero: "871.861/2006",
    hectares: "923,25",
    observacao: "Não informado",
  },
  {
    key: "3",
    id: "3",
    nome: "873.335/2006",
    numero: "873.335/2006",
    hectares: "871,51",
    observacao: "Não informado",
  },
];

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

// Função para mapear Processo para ProcessoFormValues
const mapProcessoToFormValues = (processo: Processo): ProcessoFormValues => {
  return {
    nome: processo.nome || "",
    numero: processo.numero || "",
    hectares: processo.hectares || "",
    observacao: processo.observacao || "",
  };
};

const EditProcessoPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<ProcessoFormValues>({
    defaultValues: {
      nome: "",
      numero: "",
      hectares: "",
      observacao: "",
    },
  });

  useEffect(() => {
    // Simular busca de dados do processo
    const fetchProcessoData = () => {
      setLoading(true);
      
      // Buscar processo do array de exemplo
      const processo = mockProcessos.find((p) => p.id === id);
      
      if (processo) {
        // Mapear dados do processo para o formato do formulário
        const formData = mapProcessoToFormValues(processo);
        // Resetar formulário com os dados do processo
        reset(formData);
      }
      
      setLoading(false);
    };

    if (id) {
      fetchProcessoData();
    }
  }, [id, reset]);

  const onSubmit = (data: ProcessoFormValues) => {
    console.log("Atualizar processo:", { id, ...data });
    // Implementar lógica de atualização
    // Após salvar, redirecionar para lista de processos
    router.push("/processos");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Editar Processo
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
          Atualizar
        </Button>
      </form>
    </div>
  );
};

export default EditProcessoPage;
