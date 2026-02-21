"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Input, Modal, Row, Select, Tooltip, message } from "antd";
import { useForm, Controller, useWatch } from "react-hook-form";
import { HookFormCnpjInput, HookFormCpfInput, HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";
import { getCertificateById, replaceCertificate } from "../../actions";
import { createClient, getClientsByType } from "../../../clientes/actions";
import { getAllMiningSites } from "../../../mineradoras/actions";
import { getAllSubstances } from "../../../substancias/actions";
import { capitalizeWords } from "@/utils/capitalize";
import { usePesoValorCalculo } from "@/hooks/usePesoValorCalculo";
import {
  certificadoFormSchema,
  type CertificadoFormSchema,
} from "@/schemas/certificado.schema";
import {
  newDeclaranteFormSchema,
  type NewDeclaranteFormSchema,
} from "@/schemas/declarante.schema";
import { mapNewDeclaranteToCreateDto } from "@/types/client";

function parseBrToNumber(value: string): number {
  return Number(String(value).replace(/\./g, "").replace(",", ".")) || 0;
}

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
const isStructuralFieldsLocked = true;

interface EditCertificadoFormValues {
  client_id: number;
  miningSiteId: number;
  substanceId: number | null;
  unit: string | null;
  description: string | null;
  productType: string | null;
  weight: number;
  observation: string | null;
  valTotal: number;
}

const quickDeclaranteOptions: SelectOption[] = [
  { value: "same_as_client", label: "Usar dados do cliente como declarante" },
  { value: "new_declarante", label: "Novo declarante" },
];

const unidadesMedidaOptions: SelectOption[] = [
  { value: "kg", label: "Kg - Quilogramas" },
  { value: "ct", label: "Ct - Quilates" },
  { value: "g", label: "G - Gramas" },
];

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

const EditCertificadoPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isNewDeclaranteModalOpen, setIsNewDeclaranteModalOpen] = useState(false);
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingReplacePayload, setPendingReplacePayload] = useState<EditCertificadoFormValues | null>(null);
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

  const { control, handleSubmit, setValue, reset } = useForm<CertificadoFormSchema>({
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

  const loadClientsAndDeclarantes = useCallback((showLoading = true) => {
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
  }, []);

  const loadMiningSites = useCallback((showLoading = true) => {
    if (showLoading) queueMicrotask(() => setMineradorasLoading(true));
    getAllMiningSites()
      .then((sites) => {
        setMineradorasOptions(
          sites.map((m) => ({ value: String(m.id), label: capitalizeWords(m.name) }))
        );
      })
      .catch(() => {
        message.error("Falha ao carregar mineradoras.");
      })
      .finally(() => {
        setMineradorasLoading(false);
      });
  }, []);

  const loadSubstances = useCallback((showLoading = true) => {
    if (showLoading) queueMicrotask(() => setSubstanciasLoading(true));
    getAllSubstances()
      .then((substances) => {
        setSubstanciasOptions(
          substances.map((s) => ({ value: String(s.id), label: capitalizeWords(s.name) }))
        );
      })
      .catch(() => {
        message.error("Falha ao carregar substâncias.");
      })
      .finally(() => {
        setSubstanciasLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([getCertificateById(Number(id)), loadClientsAndDeclarantes(), loadMiningSites(), loadSubstances()])
      .then(([cert]) => {
        if (cancelled || !cert) return;
        const pesoStr =
          cert.weight != null
            ? Number(cert.weight).toLocaleString("pt-BR", { minimumFractionDigits: 5 })
            : "0,00000";
        const valorPorPesoStr =
          cert.weight != null && cert.valTotal != null && Number(cert.weight) > 0
            ? Number(Number(cert.valTotal) / Number(cert.weight)).toLocaleString("pt-BR", { minimumFractionDigits: 4 })
            : "0,0000";
        const valorStr =
          cert.valTotal != null
            ? Number(cert.valTotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
            : "0,00";
        const declarantValue =
          cert.declarantUserId != null
            ? (cert.declarantUserId === cert.client_id ? "same_as_client" : String(cert.declarantUserId))
            : "same_as_client";
        reset({
          cliente: String(cert.client_id),
          declarante: declarantValue,
          mineradora: String(cert.miningSiteId),
          substancia: cert.substanceId != null ? String(cert.substanceId) : "",
          unidadeMedida: cert.unit ?? "kg",
          categoria: cert.productType ?? "",
          peso: pesoStr,
          valorPorPeso: valorPorPesoStr,
          valorTotal: valorStr,
          descricao: cert.description ?? "",
          informacoesAdicionais: cert.observation ?? "",
          descricaoImagem: "",
        });
        pesoValorCalc.setPeso(pesoStr);
        pesoValorCalc.setValorPorPeso(valorPorPesoStr);
        pesoValorCalc.setValorTotal(valorStr);
      })
      .catch(() => {
        if (!cancelled) message.error("Falha ao carregar certificado.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, loadClientsAndDeclarantes, loadMiningSites, loadSubstances, reset]);

  useEffect(() => {
    setValue("peso", pesoValorCalc.peso);
    setValue("valorPorPeso", pesoValorCalc.valorPorPeso);
    setValue("valorTotal", pesoValorCalc.valorTotal);
  }, [pesoValorCalc.peso, pesoValorCalc.valorPorPeso, pesoValorCalc.valorTotal, setValue]);

  const onSubmit = async (data: CertificadoFormSchema) => {
    setPendingReplacePayload({
      client_id: Number(data.cliente),
      miningSiteId: Number(data.mineradora),
      substanceId: data.substancia ? Number(data.substancia) : null,
      unit: data.unidadeMedida || null,
      description: data.descricao || null,
      productType: data.categoria || null,
      weight: parseBrToNumber(data.peso),
      observation: data.informacoesAdicionais || null,
      valTotal: parseBrToNumber(data.valorTotal),
    });
    setCancelReason("");
    setReplaceModalOpen(true);
  };

  const declaranteValue = useWatch({ control, name: "declarante" });
  const showNewDeclaranteButton = !isStructuralFieldsLocked && declaranteValue === "new_declarante";

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

  const handleConfirmReplace = async () => {
    const reason = cancelReason.trim();
    if (!reason) {
      message.warning("Informe o motivo do cancelamento para continuar.");
      return;
    }
    if (!pendingReplacePayload) {
      setReplaceModalOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      await replaceCertificate(Number(id), {
        ...pendingReplacePayload,
        cancelReason: reason,
      });
      message.success("Certificado substituído com sucesso. Uma nova versão foi criada.");
      setReplaceModalOpen(false);
      setPendingReplacePayload(null);
      router.push("/certificados");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao substituir certificado."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button
            type="default"
            htmlType="button"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/certificados")}
          >
            Voltar
          </Button>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
            Editar Certificado
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <Alert
            type="info"
            message="Nesta edição, apenas peso, valores e textos podem ser alterados."
            style={{ marginBottom: 16 }}
            showIcon
          />
          <div style={gridRow2Style}>
            <HookFormSelect
              name="cliente"
              control={control}
              label="*Cliente:"
              options={clientesOptions}
              placeholder="Selecione um Cliente"
              style={inputFullStyle}
              loading={clientsLoading}
              disabled={isStructuralFieldsLocked}
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
                      disabled={isStructuralFieldsLocked}
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
                disabled={isStructuralFieldsLocked}
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
                disabled={isStructuralFieldsLocked}
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
                disabled={isStructuralFieldsLocked}
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
                disabled={isStructuralFieldsLocked}
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
                      disabled
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

          <div>
            <Controller
              name="informacoesAdicionais"
              control={control}
              render={({ field }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>
                    Informações adicionais:
                  </label>
                  <Input.TextArea {...field} placeholder="Observação" rows={4} />
                </div>
              )}
            />
          </div>
        </section>

        <Button type="primary" htmlType="submit" loading={submitting}>
          Salvar nova versão
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

      <Modal
        title="Substituir certificado"
        open={replaceModalOpen}
        onCancel={() => {
          if (submitting) return;
          setReplaceModalOpen(false);
        }}
        onOk={handleConfirmReplace}
        okText="Confirmar e criar nova versão"
        cancelText="Cancelar"
        confirmLoading={submitting}
        okButtonProps={{ disabled: submitting }}
      >
        <p style={{ marginBottom: 12 }}>
          Este certificado será substituido para manter o histórico de alterações.
        </p>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
          Motivo da alteração ou substituição
        </label>
        <Input.TextArea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={3}
          maxLength={512}
          placeholder="Ex: Correção de peso e valor total após revisão"
        />
      </Modal>
    </div>
  );
};

export default EditCertificadoPage;
