"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";

interface MineradoraFormValues {
  processo: string;
  nome: string;
  numeroConcessao: string;
  observacao: string;
}

interface Mineradora {
  key: string;
  id: string;
  nome: string;
  processo: string;
  concessao: string;
  observacao: string;
}

// Dados de exemplo de processos (mesmos da lista de processos)
const processosOptions: SelectOption[] = [
  { value: "1", label: "871.860/2006" },
  { value: "2", label: "871.861/2006" },
  { value: "3", label: "873.335/2006" },
];

// Dados de exemplo (mesmos da lista de mineradoras)
const mockMineradoras: Mineradora[] = [
  {
    key: "2",
    id: "2",
    nome: "MINAS DIVERSAS (871.861/2006)",
    processo: "871.861/2006",
    concessao: "",
    observacao: "ATIVA",
  },
  {
    key: "3",
    id: "3",
    nome: "MINAS DIVERSAS (871.860/2006)",
    processo: "871.860/2006",
    concessao: "",
    observacao: "ATIVA",
  },
  {
    key: "4",
    id: "4",
    nome: "MINAS DIVERSAS (873.335/2006)",
    processo: "873.335/2006",
    concessao: "",
    observacao: "ATIVA",
  },
];

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

// Função para mapear Mineradora para MineradoraFormValues
const mapMineradoraToFormValues = (mineradora: Mineradora): MineradoraFormValues => {
  // Encontrar o ID do processo baseado no número do processo
  const processoOption = processosOptions.find((p) => p.label === mineradora.processo);
  
  return {
    processo: processoOption?.value || "",
    nome: mineradora.nome || "",
    numeroConcessao: mineradora.concessao || "",
    observacao: mineradora.observacao || "",
  };
};

const EditMineradoraPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<MineradoraFormValues>({
    defaultValues: {
      processo: "",
      nome: "",
      numeroConcessao: "",
      observacao: "",
    },
  });

  useEffect(() => {
    // Simular busca de dados da mineradora
    const fetchMineradoraData = () => {
      setLoading(true);
      
      // Buscar mineradora do array de exemplo
      const mineradora = mockMineradoras.find((m) => m.id === id);
      
      if (mineradora) {
        // Mapear dados da mineradora para o formato do formulário
        const formData = mapMineradoraToFormValues(mineradora);
        // Resetar formulário com os dados da mineradora
        reset(formData);
      }
      
      setLoading(false);
    };

    if (id) {
      fetchMineradoraData();
    }
  }, [id, reset]);

  const onSubmit = (data: MineradoraFormValues) => {
    console.log("Atualizar mineradora:", { id, ...data });
    // Implementar lógica de atualização
    // Após salvar, redirecionar para lista de mineradoras
    router.push("/mineradoras");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Editar Mineradora
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Nova
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
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="nome"
              control={control}
              label="*Nome:"
              placeholder="Digite nome do processo"
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

export default EditMineradoraPage;
