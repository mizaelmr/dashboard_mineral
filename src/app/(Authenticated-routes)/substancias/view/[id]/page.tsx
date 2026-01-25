"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button, Table, Space, Modal, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Substancia {
  key: string;
  id: string;
  nome: string;
}

interface Imposto {
  key: string;
  id: string;
  nome: string;
  valor: string;
  observacao: string;
}

interface ImpostoFormValues {
  tipoImposto: string;
  valor: string;
  observacao: string;
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

// Dados de exemplo de impostos (simulando dados da API)
const mockImpostos: Imposto[] = [
  {
    key: "1",
    id: "1",
    nome: "ICMS %",
    valor: "12%",
    observacao: "-",
  },
  {
    key: "2",
    id: "2",
    nome: "PIS %",
    valor: "0.65%",
    observacao: "-",
  },
  {
    key: "3",
    id: "3",
    nome: "COFINS %",
    valor: "3.0%",
    observacao: "-",
  },
  {
    key: "4",
    id: "4",
    nome: "CGB %",
    valor: "0.25%",
    observacao: "-",
  },
  {
    key: "5",
    id: "5",
    nome: "CFEM %",
    valor: "2.0%",
    observacao: "-",
  },
  {
    key: "6",
    id: "6",
    nome: "TAXA CMB %",
    valor: "5.0%",
    observacao: "-",
  },
  {
    key: "7",
    id: "7",
    nome: "TOTAL %",
    valor: "22.9%",
    observacao: "-",
  },
];

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const ViewSubstanciaPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [substancia, setSubstancia] = useState<Substancia | null>(null);
  const [impostos, setImpostos] = useState<Imposto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImposto, setEditingImposto] = useState<Imposto | null>(null);

  const { control, handleSubmit, reset } = useForm<ImpostoFormValues>({
    defaultValues: {
      tipoImposto: "",
      valor: "",
      observacao: "",
    },
  });

  useEffect(() => {
    const loadSubstancia = () => {
      setLoading(true);
      const substanciaData = mockSubstancias.find((s) => s.id === id);
      setSubstancia(substanciaData || null);
      
      // Carregar impostos (simulando busca de API)
      if (substanciaData) {
        setImpostos(mockImpostos);
      }
      
      setLoading(false);
    };

    if (id) {
      loadSubstancia();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/substancias/edit/${id}`);
  };

  const handleBack = () => {
    router.push("/substancias");
  };

  const handleNewImposto = () => {
    setEditingImposto(null);
    reset({
      tipoImposto: "",
      valor: "",
      observacao: "",
    });
    setIsModalOpen(true);
  };

  const handleEditImposto = (imposto: Imposto) => {
    setEditingImposto(imposto);
    reset({
      tipoImposto: imposto.nome || "",
      valor: imposto.valor || "",
      observacao: imposto.observacao || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingImposto(null);
    reset({
      tipoImposto: "",
      valor: "",
      observacao: "",
    });
  };

  const onSubmitImposto = (data: ImpostoFormValues) => {
    if (editingImposto) {
      // Editar imposto existente
      setImpostos(
        impostos.map((imp) =>
          imp.id === editingImposto.id
            ? {
                ...imp,
                nome: data.tipoImposto,
                valor: data.valor,
                observacao: data.observacao,
              }
            : imp
        )
      );
    } else {
      // Adicionar novo imposto
      const newImposto: Imposto = {
        key: String(impostos.length + 1),
        id: String(impostos.length + 1),
        nome: data.tipoImposto,
        valor: data.valor,
        observacao: data.observacao || "-",
      };
      setImpostos([...impostos, newImposto]);
    }
    handleCloseModal();
  };

  const handleDeleteImposto = (impostoId: string) => {
    console.log("Excluir imposto:", impostoId);
    // Implementar lógica de excluir imposto
    setImpostos(impostos.filter((i) => i.id !== impostoId));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!substancia) {
    return (
      <div>
        <Button onClick={handleBack} style={{ marginBottom: 16 }}>
          Voltar
        </Button>
        <div>Substância não encontrada</div>
      </div>
    );
  }

  const columns: ColumnsType<Imposto> = [
    {
      title: "Imposto",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
    {
      title: "Observação",
      dataIndex: "observacao",
      key: "observacao",
    },
    {
      title: "Ação",
      key: "acao",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditImposto(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteImposto(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
          Detalhes
        </h1>
        <Space>
          <Button onClick={handleBack}>Voltar</Button>
          <Button
            type="primary"
            onClick={handleNewImposto}
          >
            NOVO
          </Button>
        </Space>
      </div>

      <section style={sectionStyle}>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          {substancia.nome}
        </h2>
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: "16px",
            fontWeight: 500,
            color: "#666",
          }}
        >
          Informações de impostos
        </h3>
        <Table<Imposto>
          columns={columns}
          dataSource={impostos}
          pagination={false}
          rowKey="id"
          bordered
        />
      </section>

      <Modal
        title={editingImposto ? "Editar imposto" : "Cadastro de novo imposto"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmitImposto)}>
          <div style={{ marginBottom: 16 }}>
            <Controller
              name="tipoImposto"
              control={control}
              rules={{ required: "Tipo de imposto é obrigatório" }}
              render={({ field, fieldState }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>
                    Tipo de imposto:
                  </label>
                  <Input
                    {...field}
                    placeholder="Digite o tipo de imposto"
                    status={fieldState.invalid ? "error" : undefined}
                  />
                  {fieldState.error?.message && (
                    <span style={{ fontSize: 12, color: "#ff4d4f", marginTop: 4, display: "block" }}>
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Controller
              name="valor"
              control={control}
              rules={{ required: "Valor é obrigatório" }}
              render={({ field, fieldState }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>
                    Valor:
                  </label>
                  <Input
                    {...field}
                    placeholder="Digite o valor"
                    status={fieldState.invalid ? "error" : undefined}
                  />
                  {fieldState.error?.message && (
                    <span style={{ fontSize: 12, color: "#ff4d4f", marginTop: 4, display: "block" }}>
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Controller
              name="observacao"
              control={control}
              render={({ field }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>
                    Observação:
                  </label>
                  <Input.TextArea
                    {...field}
                    placeholder="Digite uma observação"
                    rows={4}
                  />
                </div>
              )}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
            <Button onClick={handleCloseModal}>
              Fechar
            </Button>
            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ViewSubstanciaPage;
