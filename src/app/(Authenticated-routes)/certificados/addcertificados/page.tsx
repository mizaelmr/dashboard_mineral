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
import {
  certificadoFormSchema,
  type CertificadoFormSchema,
} from "@/schemas/certificado.schema";
import { mapNewDeclaranteToCreateDto } from "@/types/client";
import { createClient, getClientsByType } from "../../clientes/actions";
import { getAllMiningSites } from "../../mineradoras/actions";
import { getAllSubstances } from "../../substancias/actions";
import { capitalizeWords } from "@/utils/capitalize";
import { usePesoValorCalculo } from "@/hooks/usePesoValorCalculo";


const quickDeclaranteOptions: SelectOption[] = [
  { value: "same_as_client", label: "Usar dados do cliente como declarante" },
  { value: "new_declarante", label: "Novo declarante" },
];

const unidadesMedidaOptions: SelectOption[] = [
  { value: "kg", label: "Kg - Quilogramas" },
  { value: "ct", label: "Ct - Quilates" },
  { value: "g", label: "G - Gramas" },
];

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fff",
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
  const [substanciasOptions, setSubstanciasOptions] = useState<SelectOption[]>([]);
  const [substanciasLoading, setSubstanciasLoading] = useState(false);

  const pesoValorCalc = usePesoValorCalculo();

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

  const loadSubstances = (showLoading = true) => {
    if (showLoading) queueMicrotask(() => setSubstanciasLoading(true));
    getAllSubstances()
      .then((substances) => {
        setSubstanciasOptions(
          substances.map((s) => ({
            value: String(s.id),
            label: capitalizeWords(s.name),
          }))
        );
      })
      .catch(() => {
        message.error("Falha ao carregar substâncias.");
      })
      .finally(() => {
        setSubstanciasLoading(false);
      });
  };

  useEffect(() => {
    loadClientsAndDeclarantes(true);
    loadMiningSites(true);
    loadSubstances(true);
  }, []);

  const { control, handleSubmit, setValue } = useForm<CertificadoFormSchema>({
    resolver: zodResolver(certificadoFormSchema),
    defaultValues: {
      cliente: "",
      declarante: "",
      mineradora: "",
      substancia: "",
      unidadeMedida: "",
      categoria: "",
      peso: "0,00000",
      valorPorPeso: "0,0000",
      valorTotal: "0,00",
      descricao: "",
      informacoesAdicionais: "",
      descricaoImagem: "",
    },
  });

  useEffect(() => {
    setValue("peso", pesoValorCalc.peso);
    setValue("valorPorPeso", pesoValorCalc.valorPorPeso);
    setValue("valorTotal", pesoValorCalc.valorTotal);
  }, [pesoValorCalc.peso, pesoValorCalc.valorPorPeso, pesoValorCalc.valorTotal, setValue]);

  const declaranteValue = useWatch({ control, name: "declarante" });
  const showNewDeclaranteButton = declaranteValue === "new_declarante";

  const resolveDeclaranteId = (data: CertificadoFormSchema): number | null => {
    if (data.declarante === "same_as_client") {
      return data.cliente ? Number(data.cliente) : null;
    }
    if (data.declarante === "new_declarante" || data.declarante === "") {
      return null;
    }
    return Number(data.declarante);
  };

  const onSubmit = (data: CertificadoFormSchema) => {
    const declaranteId = resolveDeclaranteId(data);
    if (declaranteId == null) return;
    const payload = {
      clienteId: Number(data.cliente),
      declaranteId,
      mineradoraId: Number(data.mineradora),
      substanciaId: Number(data.substancia),
      unidadeMedida: data.unidadeMedida,
      categoria: data.categoria,
      peso: data.peso,
      valorPorPeso: data.valorPorPeso,
      valorTotal: data.valorTotal,
      descricao: data.descricao,
      informacoesAdicionais: data.informacoesAdicionais,
      descricaoImagem: data.descricaoImagem,
    };
    console.log("Salvar certificado:", payload);
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
        
          <div style={gridRow2Style}>
            <HookFormSelect
              name="cliente"
              control={control}
              label="*Cliente:"
              options={clientesOptions}
              placeholder="Selecione um Cliente"
              style={inputFullStyle}
              loading={clientsLoading}
            />
            <Controller
              name="declarante"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <label htmlFor="declarante" style={{ display: "block", marginBottom: 4 }}>
                    *Declarante:
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
                style={inputFullStyle}
              />
            </Col>
            <Col span={8}>
              <HookFormSelect
                name="substancia"
                control={control}
                label="*Substância:"
                options={substanciasOptions}
                placeholder="Selecione uma substância"
                style={inputFullStyle}
                loading={substanciasLoading}
              />
            </Col>
            <Col span={8}>
              <HookFormSelect
                name="unidadeMedida"
                control={control}
                label="*Unidade de Medida:"
                options={unidadesMedidaOptions}
                placeholder="Selecione uma Unidade"
                style={inputFullStyle}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Controller
                name="peso"
                control={control}
                render={({ fieldState }) => (
                  <div>
                    <label style={{ display: "block", marginBottom: 4 }}>
                      *Peso (Kg):
                    </label>
                    <Input
                      value={pesoValorCalc.peso}
                      onChange={pesoValorCalc.handlePesoChange}
                      placeholder="0,00000"
                      style={inputFullStyle}
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
            </Col>
            <Col span={8}>
              <Controller
                name="valorPorPeso"
                control={control}
                render={({ fieldState }) => (
                  <div>
                    <label style={{ display: "block", marginBottom: 4 }}>
                      *Valor por peso (R$/Kg):
                    </label>
                    <Input
                      value={pesoValorCalc.valorPorPeso}
                      onChange={pesoValorCalc.handleValorPorPesoChange}
                      placeholder="0,0000"
                      style={inputFullStyle}
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
            </Col>
            <Col span={8}>
              <Controller
                name="valorTotal"
                control={control}
                render={({ fieldState }) => (
                  <div>
                    <label style={{ display: "block", marginBottom: 4 }}>
                      *Valor total (R$):
                    </label>
                    <Input
                      value={pesoValorCalc.valorTotal}
                      onChange={pesoValorCalc.handleValorTotalChange}
                      placeholder="0,00"
                      style={inputFullStyle}
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
            </Col>
          </Row>

          <div style={{ marginBottom: 16 }}>
            <Controller
              name="descricao"
              control={control}
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
