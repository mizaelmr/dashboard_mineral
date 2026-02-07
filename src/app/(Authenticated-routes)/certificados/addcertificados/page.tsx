"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Col, Input, message, Modal, Row, Select, Tooltip, Upload } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { HookFormInput, HookFormSelect, HookFormCpfInput, HookFormCnpjInput } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";
import {
  newDeclaranteFormSchema,
  type NewDeclaranteFormSchema,
} from "@/schemas/declarante.schema";
import { mapNewDeclaranteToCreateDto } from "@/types/client";
import { createClient, getClientsByType } from "../../clientes/actions";
import { getAllMiningSites } from "../../mineradoras/actions";
import { capitalizeWords } from "@/utils/capitalize";

interface CertificadoFormValues {
  cliente: string;
  declarante: string;
  mineradora: string;
  substancia: string;
  unidadeMedida: string;
  categoria: string;
  peso: string;
  valorPorPeso: string;
  valorTotal: string;
  descricao: string;
  informacoesAdicionais: string;
  descricaoImagem: string;
}

const quickDeclaranteOptions: SelectOption[] = [
  { value: "same_as_client", label: "Usar dados do cliente como declarante" },
  { value: "new_declarante", label: "Novo declarante" },
];

const substanciasOptions: SelectOption[] = [
  { value: "1", label: "ESMERALDA" },
  { value: "2", label: "ALEXANDRITA" },
  { value: "3", label: "MOLIBDENIO" },
];

const unidadesMedidaOptions: SelectOption[] = [
  { value: "kg", label: "Kg" },
  { value: "g", label: "g" },
  { value: "t", label: "t" },
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

const newDeclaranteButtonStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  minWidth: 32,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#52c41a",
  borderColor: "#52c41a",
  color: "#fff",
};

const AddCertificadosPage: React.FC = () => {
  const [isNewDeclaranteModalOpen, setIsNewDeclaranteModalOpen] = useState(false);
  const [clientesOptions, setClientesOptions] = useState<SelectOption[]>([]);
  const [declarantesGroupedOptions, setDeclarantesGroupedOptions] = useState<
    { label: string; options: SelectOption[] }[]
  >([{ label: "Escolha rápida", options: quickDeclaranteOptions }]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [mineradorasOptions, setMineradorasOptions] = useState<SelectOption[]>([]);
  const [mineradorasLoading, setMineradorasLoading] = useState(false);

  const loadClientsAndDeclarantes = (showLoading = true) => {
    if (showLoading) queueMicrotask(() => setClientsLoading(true));
    Promise.all([getClientsByType(1), getClientsByType(2)])
      .then(([type1Clients, type2Clients]) => {
        setClientesOptions(
          type1Clients.map((c) => ({ value: String(c.id), label: capitalizeWords(c.name) }))
        );
        setDeclarantesGroupedOptions([
          { label: "Escolha rápida", options: quickDeclaranteOptions },
          {
            label: "Declarantes cadastrados",
            options: type2Clients.map((c) => ({ value: String(c.id), label: capitalizeWords(c.name) })),
          },
        ]);
      })
      .catch(() => {
        message.error("Falha ao carregar clientes e declarantes.");
      })
      .finally(() => {
        setClientsLoading(false);
      });
  };

  const loadMiningSites = (showLoading = true) => {
    if (showLoading) queueMicrotask(() => setMineradorasLoading(true));
    getAllMiningSites()
      .then((sites) => {
        setMineradorasOptions(
          sites.map((m) => ({
            value: String(m.id),
            label: capitalizeWords(m.name),
          }))
        );
      })
      .catch(() => {
        message.error("Falha ao carregar mineradoras.");
      })
      .finally(() => {
        setMineradorasLoading(false);
      });
  };

  useEffect(() => {
    loadClientsAndDeclarantes(true);
    loadMiningSites(true);
  }, []);

  const { control, handleSubmit } = useForm<CertificadoFormValues>({
    defaultValues: {
      cliente: "",
      declarante: "",
      mineradora: "",
      substancia: "",
      unidadeMedida: "",
      categoria: "",
      peso: "0,00000",
      valorPorPeso: "0,0000",
      valorTotal: "0.00",
      descricao: "",
      informacoesAdicionais: "",
      descricaoImagem: "",
    },
  });

  const declaranteValue = useWatch({ control, name: "declarante" });
  const showNewDeclaranteButton = declaranteValue === "new_declarante";

  const onSubmit = (data: CertificadoFormValues) => {
    console.log("Salvar certificado:", data);
  };

  const newDeclaranteForm = useForm<NewDeclaranteFormSchema>({
    resolver: zodResolver(newDeclaranteFormSchema),
    defaultValues: { nome: "", cpf: "", razaoSocial: "", cnpj: "" },
  });

  const handleOpenNewDeclaranteModal = () => setIsNewDeclaranteModalOpen(true);
  const handleCloseNewDeclaranteModal = () => {
    setIsNewDeclaranteModalOpen(false);
    newDeclaranteForm.reset();
  };

  const handleSubmitNewDeclarante = async (data: NewDeclaranteFormSchema) => {
    try {
      const dto = mapNewDeclaranteToCreateDto(data);
      await createClient(dto);
      message.success("Declarante cadastrado com sucesso.");
      handleCloseNewDeclaranteModal();
      loadClientsAndDeclarantes(false);
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "Erro ao cadastrar declarante."
      );
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: "24px", fontWeight: 600 }}>
        Cadastro de Certificado
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Cadastro de certificado de origem
          </h2>
          
          <div style={gridRow2Style}>
            <HookFormSelect
              name="cliente"
              control={control}
              label="*Cliente:"
              options={clientesOptions}
              placeholder="Selecione um Cliente"
              rules={{ required: "Cliente é obrigatório" }}
              style={inputFullStyle}
              loading={clientsLoading}
            />
            <Controller
              name="declarante"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <label htmlFor="declarante" style={{ display: "block", marginBottom: 4 }}>
                    Declarante:
                  </label>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Select
                      id="declarante"
                      {...field}
                      options={declarantesGroupedOptions}
                      placeholder="Selecione um Declarante"
                      style={{ flex: 1, width: "100%" }}
                      value={field.value === "" || field.value == null ? undefined : field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value === "new_declarante") {
                          handleOpenNewDeclaranteModal();
                        }
                      }}
                      onBlur={field.onBlur}
                      status={fieldState.invalid ? "error" : undefined}
                      loading={clientsLoading}
                    />
                    {showNewDeclaranteButton && (
                      <Tooltip title="Novo declarante">
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          style={newDeclaranteButtonStyle}
                          onClick={handleOpenNewDeclaranteModal}
                        />
                      </Tooltip>
                    )}
                  </div>
                  {fieldState.error?.message != null && (
                    <span style={{ fontSize: 12, color: "#ff4d4f", marginTop: 4, display: "block" }}>
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <HookFormSelect
                name="mineradora"
                control={control}
                label="*Mineradora:"
                options={mineradorasOptions}
                placeholder="Selecione uma Mineradora"
                rules={{ required: "Mineradora é obrigatória" }}
                style={inputFullStyle}
                loading={mineradorasLoading}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <HookFormInput
                name="categoria"
                control={control}
                label="*Categoria:"
                placeholder="Digite a categoria do produto"
                rules={{ required: "Categoria é obrigatória" }}
                style={inputFullStyle}
              />
            </Col>
            <Col span={8}>
              <HookFormSelect
                name="substancia"
                control={control}
                label="*Substância:"
                options={substanciasOptions}
                placeholder="selecione"
                rules={{ required: "Substância é obrigatória" }}
                style={inputFullStyle}
              />
            </Col>
            <Col span={8}>
              <HookFormSelect
                name="unidadeMedida"
                control={control}
                label="*Unidade de Medida:"
                options={unidadesMedidaOptions}
                placeholder="Selecione uma Unidade"
                rules={{ required: "Unidade de Medida é obrigatória" }}
                style={inputFullStyle}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <HookFormInput
                name="peso"
                control={control}
                label="*Peso (Kg):"
                placeholder="0,00000"
                rules={{ required: "Peso é obrigatório" }}
                style={inputFullStyle}
              />
            </Col>
            <Col span={8}>
              <HookFormInput
                name="valorPorPeso"
                control={control}
                label="*Valor por peso (R$/Kg):"
                placeholder="0,0000"
                rules={{ required: "Valor por peso é obrigatório" }}
                style={inputFullStyle}
              />
            </Col>
            <Col span={8}>
              <HookFormInput
                name="valorTotal"
                control={control}
                label="*Valor total (R$):"
                placeholder="0.00"
                rules={{ required: "Valor total é obrigatório" }}
                style={inputFullStyle}
              />
            </Col>
          </Row>

          <div style={{ marginBottom: 16 }}>
            <Controller
              name="descricao"
              control={control}
              rules={{ required: "Descrição é obrigatória" }}
              render={({ field, fieldState }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>
                    *Descrição:
                  </label>
                  <Input.TextArea
                    {...field}
                    placeholder="Digite uma descrição para o produto"
                    rows={4}
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
              name="informacoesAdicionais"
              control={control}
              render={({ field }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>
                    Informações adicionais:
                  </label>
                  <Input.TextArea
                    {...field}
                    placeholder="Observação"
                    rows={4}
                  />
                </div>
              )}
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Imagens:
          </h3>
          <div style={{ marginBottom: 16 }}>
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="descricaoImagem"
              control={control}
              label="Descrição da imagem:"
              placeholder="Descrição para imagem (opcional)"
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

      <Modal
        title="Novo Declarante"
        open={isNewDeclaranteModalOpen}
        onCancel={handleCloseNewDeclaranteModal}
        footer={null}
        destroyOnClose
      >
        <Alert
          type="warning"
          message="Atenção!"
          description="Preencha nome e CPF ou razão social e CNPJ."
          style={{ marginBottom: 24 }}
          showIcon
        />
        <form onSubmit={newDeclaranteForm.handleSubmit(handleSubmitNewDeclarante)}>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="nome"
              control={newDeclaranteForm.control}
              label="Nome:"
              placeholder="Nome completo"
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormCpfInput
              name="cpf"
              control={newDeclaranteForm.control}
              label="CPF:"
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="razaoSocial"
              control={newDeclaranteForm.control}
              label="Razão social:"
              placeholder="Razão social"
              style={inputFullStyle}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <HookFormCnpjInput
              name="cnpj"
              control={newDeclaranteForm.control}
              label="CNPJ:"
              style={inputFullStyle}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={handleCloseNewDeclaranteModal}>Cancelar</Button>
            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddCertificadosPage;
