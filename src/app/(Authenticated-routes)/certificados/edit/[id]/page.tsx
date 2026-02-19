"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";
import { getCertificateById, updateCertificate } from "../actions";
import { getClientsByType } from "../../clientes/actions";
import { getAllMiningSites } from "../../mineradoras/actions";
import { getAllSubstances } from "../../substancias/actions";
import { capitalizeWords } from "@/utils/capitalize";
import { usePesoValorCalculo } from "@/hooks/usePesoValorCalculo";

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

interface EditCertificadoFormValues {
  cliente: string;
  mineradora: string;
  substancia: string;
  categoria: string;
  peso: string;
  valorTotal: string;
  descricao: string;
  informacoesAdicionais: string;
}

const EditCertificadoPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clientesOptions, setClientesOptions] = useState<SelectOption[]>([]);
  const [mineradorasOptions, setMineradorasOptions] = useState<SelectOption[]>([]);
  const [substanciasOptions, setSubstanciasOptions] = useState<SelectOption[]>([]);

  const pesoValorCalc = usePesoValorCalculo();

  const { control, handleSubmit, setValue, reset } = useForm<EditCertificadoFormValues>({
    defaultValues: {
      cliente: "",
      mineradora: "",
      substancia: "",
      categoria: "",
      peso: "0,00000",
      valorTotal: "0,00",
      descricao: "",
      informacoesAdicionais: "",
    },
  });

  const loadOptions = useCallback(async () => {
    try {
      const [clients, sites, substances] = await Promise.all([
        getClientsByType(1),
        getAllMiningSites(),
        getAllSubstances(),
      ]);
      setClientesOptions(
        clients.map((c) => ({ value: String(c.id), label: capitalizeWords(c.name) }))
      );
      setMineradorasOptions(
        sites.map((m) => ({ value: String(m.id), label: capitalizeWords(m.name) }))
      );
      setSubstanciasOptions(
        substances.map((s) => ({ value: String(s.id), label: capitalizeWords(s.name) }))
      );
    } catch {
      message.error("Falha ao carregar opções.");
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([getCertificateById(Number(id)), loadOptions()])
      .then(([cert]) => {
        if (cancelled || !cert) return;
        const pesoStr =
          cert.weight != null
            ? Number(cert.weight).toLocaleString("pt-BR", { minimumFractionDigits: 5 })
            : "0,00000";
        const valorStr =
          cert.valTotal != null
            ? Number(cert.valTotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
            : "0,00";
        reset({
          cliente: String(cert.client_id),
          mineradora: String(cert.miningSiteId),
          substancia: cert.substanceId != null ? String(cert.substanceId) : "",
          categoria: cert.productType ?? "",
          peso: pesoStr,
          valorTotal: valorStr,
          descricao: cert.description ?? "",
          informacoesAdicionais: cert.observation ?? "",
        });
        pesoValorCalc.setPeso(pesoStr);
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
  }, [id, loadOptions, reset]);

  useEffect(() => {
    setValue("peso", pesoValorCalc.peso);
    setValue("valorTotal", pesoValorCalc.valorTotal);
  }, [pesoValorCalc.peso, pesoValorCalc.valorTotal, setValue]);

  const onSubmit = async (data: EditCertificadoFormValues) => {
    setSubmitting(true);
    try {
      await updateCertificate(Number(id), {
        client_id: Number(data.cliente),
        miningSiteId: Number(data.mineradora),
        substanceId: data.substancia ? Number(data.substancia) : null,
        description: data.descricao || null,
        productType: data.categoria || null,
        weight: parseBrToNumber(data.peso),
        observation: data.informacoesAdicionais || null,
        valTotal: parseBrToNumber(data.valorTotal),
      });
      message.success("Certificado atualizado com sucesso.");
      router.push("/certificados");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao atualizar certificado."
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
          <div style={gridRow2Style}>
            <HookFormSelect
              name="cliente"
              control={control}
              label="*Cliente:"
              options={clientesOptions}
              placeholder="Selecione um Cliente"
              style={inputFullStyle}
            />
            <HookFormSelect
              name="mineradora"
              control={control}
              label="*Mineradora:"
              options={mineradorasOptions}
              placeholder="Selecione uma Mineradora"
              style={inputFullStyle}
            />
          </div>
          <div style={gridRow2Style}>
            <HookFormSelect
              name="substancia"
              control={control}
              label="Substância:"
              options={substanciasOptions}
              placeholder="Selecione uma substância"
              style={inputFullStyle}
            />
            <HookFormInput
              name="categoria"
              control={control}
              label="Categoria:"
              placeholder="Categoria do produto"
              style={inputFullStyle}
            />
          </div>
          <div style={gridRow2Style}>
            <Controller
              name="peso"
              control={control}
              render={({ field }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>*Peso (Kg):</label>
                  <Input
                    value={pesoValorCalc.peso}
                    onChange={(e) => {
                      pesoValorCalc.handlePesoChange(e);
                      field.onChange(e.target.value);
                    }}
                    placeholder="0,00000"
                    style={inputFullStyle}
                  />
                </div>
              )}
            />
            <Controller
              name="valorTotal"
              control={control}
              render={({ field }) => (
                <div>
                  <label style={{ display: "block", marginBottom: 4 }}>*Valor total (R$):</label>
                  <Input
                    value={pesoValorCalc.valorTotal}
                    onChange={(e) => {
                      pesoValorCalc.handleValorTotalChange(e);
                      field.onChange(e.target.value);
                    }}
                    placeholder="0,00"
                    style={inputFullStyle}
                  />
                </div>
              )}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <HookFormInput
              name="descricao"
              control={control}
              label="Descrição:"
              placeholder="Descrição"
              style={inputFullStyle}
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
          Atualizar
        </Button>
      </form>
    </div>
  );
};

export default EditCertificadoPage;
