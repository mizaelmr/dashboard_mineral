"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UploadFile } from "antd";
import { Alert, Button, Col, Input, message, Modal, Row, Select, Tooltip, Upload } from "antd";
import { CrownOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
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
import { createCertificate } from "../actions";
import { useRouter } from "next/navigation";
import { useActiveMandate } from "@/contexts/active-mandate-context";
import { apiUploadFile } from "@/lib/api-client";
import { getToken } from "@/lib/auth";


const quickDeclaranteOptions: SelectOption[] = [
  { value: "same_as_client", label: "Usar dados do cliente como declarante" },
  { value: "new_declarante", label: "Novo declarante" },
];

const unidadesMedidaOptions: SelectOption[] = [
  { value: "kg", label: "Kg - Quilogramas" },
  { value: "ct", label: "Ct - Quilates" },
  { value: "g", label: "G - Gramas" },
];

const tipoTransporteOptions: SelectOption[] = [
  { value: "terrestre", label: "Terrestre" },
  { value: "aereo", label: "Aéreo" },
  { value: "fluvial", label: "Fluvial" },
  { value: "maritimo", label: "Marítimo" },
  { value: "ferroviario", label: "Ferroviário" },
  { value: "multimodal", label: "Multimodal" },
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

function parseBrToNumber(value: string): number {
  return Number(String(value).replace(/\./g, "").replace(",", ".")) || 0;
}

const AddCertificadosPage: React.FC = () => {
  const router = useRouter();
  const { activeMandate, loading: activeMandateLoading } = useActiveMandate();
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

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
      destino: "",
      tipoTransporte: "",
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

  const onSubmit = async (data: CertificadoFormSchema) => {
    const declaranteId = resolveDeclaranteId(data);
    if (declaranteId == null) return;
    if (activeMandateLoading) {
      message.warning("Aguarde o carregamento do mandato ativo.");
      return;
    }
    if (!activeMandate) {
      message.error("Nenhum mandato ativo encontrado. Cadastre e ative um presidente.");
      return;
    }

    setSubmitting(true);
    try {
      let imageS3Key: string | undefined;
      let imageFileName: string | undefined;
      let imageDescription: string | undefined;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadResult = await apiUploadFile(
          "/storage/upload?folder=certificates",
          formData,
          getToken()
        );
        imageS3Key = uploadResult.key;
        imageFileName = uploadResult.fileName;
        imageDescription = data.descricaoImagem?.trim() || undefined;
      }
      await createCertificate({
        mandateId: Number(activeMandate.id),
        client_id: Number(data.cliente),
        miningSiteId: Number(data.mineradora),
        substanceId: Number(data.substancia),
        description: data.descricao,
        productType: data.categoria,
        weight: parseBrToNumber(data.peso),
        unit: data.unidadeMedida,
        observation: data.informacoesAdicionais,
        valTotal: parseBrToNumber(data.valorTotal),
        destination: data.destino?.trim() || undefined,
        transportType: data.tipoTransporte || undefined,
        imageS3Key,
        imageFileName,
        imageDescription,
      });
      message.success("Certificado cadastrado com sucesso.");
      router.push("/certificados");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Erro ao cadastrar certificado."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const newDeclaranteForm = useForm<NewDeclaranteFormSchema>({
    resolver: zodResolver(newDeclaranteFormSchema),
    defaultValues: { nome: "", cpf: "", razaoSocial: "", cnpj: "", phoneNumber: "" },
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
          {!activeMandateLoading && activeMandate && (
            <div style={{ marginTop: 8, fontSize: 13, color: "#666", display: "flex", alignItems: "center", gap: 6 }}>
              Presidente ativo: <CrownOutlined style={{ color: "#000" }} /> <strong>{capitalizeWords(activeMandate.presidentName ?? "Não informado")}</strong>
            </div>
          )}
        </section>

        <section style={sectionStyle}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Rastreabilidade:
          </h3>
          <Row gutter={16}>
            <Col span={14}>
              <HookFormInput
                name="destino"
                control={control}
                label="Destino:"
                placeholder="Ex: São Paulo - SP"
                style={inputFullStyle}
              />
            </Col>
            <Col span={10}>
              <HookFormSelect
                name="tipoTransporte"
                control={control}
                label="Tipo de transporte:"
                options={tipoTransporteOptions}
                placeholder="Selecione o transporte"
                style={inputFullStyle}
              />
            </Col>
          </Row>
        </section>

        <section style={sectionStyle}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Imagens:
          </h3>
          <div style={{ marginBottom: 16 }}>
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={imageFileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => {
                setImageFileList(fileList.slice(-1));
                const file = fileList[0]?.originFileObj as File | undefined;
                setImageFile(file ?? null);
              }}
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
          loading={submitting}
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
          <div style={{ marginBottom: 24 }}>
            <HookFormInput
              name="phoneNumber"
              control={newDeclaranteForm.control}
              label="Telefone:"
              placeholder="(00) 90000-0000"
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
