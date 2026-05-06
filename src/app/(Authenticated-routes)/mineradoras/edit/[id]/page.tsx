"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button, message, InputNumber, Space, Typography, List, Spin } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { HookFormInput, HookFormSelect } from "@/components/hook-forms";
import type { SelectOption } from "@/components/hook-forms";
import { getMiningSiteById, getAllProcesses, updateMiningSite } from "../../actions";
import { cleanLowerValue } from "@/utils/cleanLowerValue";
import { searchLocation } from "@/utils/nominatim";
import type { NominatimResult } from "@/utils/nominatim";
import { parseLatitudeValue, parseLongitudeValue } from "@/utils/parseGeographicCoordinate";

interface MineradoraFormValues {
  processo: string;
  nome: string;
  numeroConcessao: string;
  observacao: string;
  latitude: number | null;
  longitude: number | null;
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const EditMineradoraPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [processosOptions, setProcessosOptions] = useState<SelectOption[]>([]);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [locationResults, setLocationResults] = useState<NominatimResult[]>([]);
  const [locationStatus, setLocationStatus] = useState<"idle" | "found" | "not_found">("idle");

  const { control, handleSubmit, reset, watch, setValue } = useForm<MineradoraFormValues>({
    defaultValues: {
      processo: "",
      nome: "",
      numeroConcessao: "",
      observacao: "",
      latitude: null,
      longitude: null,
    },
  });

  const nomeLavra = watch("nome");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getMiningSiteById(Number(id)), getAllProcesses()])
      .then(([site, processes]) => {
        if (cancelled) return;
        setProcessosOptions(
          processes.map((p) => ({
            value: String(p.id),
            label: p.number ?? String(p.id),
          }))
        );
        if (site) {
          reset({
            processo: site.processId != null ? String(site.processId) : "",
            nome: site.name ?? "",
            numeroConcessao: site.concessionNumber ?? "",
            observacao: site.observation ?? "",
            latitude: site.latitude != null ? Number(site.latitude) : null,
            longitude: site.longitude != null ? Number(site.longitude) : null,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, reset]);

  const handleSearchLocation = async () => {
    const query = nomeLavra?.trim();
    if (!query) {
      message.warning("Digite o nome da mineradora antes de buscar.");
      return;
    }
    setSearchingLocation(true);
    setLocationResults([]);
    setLocationStatus("idle");
    try {
      const results = await searchLocation(query);
      if (results.length === 0) {
        setLocationStatus("not_found");
      } else {
        setLocationResults(results);
        setLocationStatus("found");
      }
    } catch {
      message.error("Falha ao buscar localização.");
    } finally {
      setSearchingLocation(false);
    }
  };

  const handleSelectLocation = (result: NominatimResult) => {
    const lat = parseLatitudeValue(result.lat);
    const lng = parseLongitudeValue(result.lon);
    if (lat !== null) setValue("latitude", lat);
    if (lng !== null) setValue("longitude", lng);
    setLocationResults([]);
    setLocationStatus("idle");
  };

  const onSubmit = async (data: MineradoraFormValues) => {
    try {
      const concessionNumberValue = data.numeroConcessao?.trim();
      await updateMiningSite(Number(id), {
        processId: Number(data.processo),
        name: cleanLowerValue(data.nome) ?? "",
        concessionNumber: concessionNumberValue
          ? (cleanLowerValue(data.numeroConcessao) ?? undefined)
          : null,
        observation: data.observacao?.trim() === "" ? undefined : data.observacao?.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
      });
      message.success("Mineradora atualizada com sucesso.");
      router.push("/mineradoras");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao atualizar mineradora."
      );
    }
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
            Dados
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
              placeholder="Digite nome da mineradora"
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

        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Localização
          </h2>

          <Space style={{ marginBottom: 12 }}>
            <Button
              icon={<SearchOutlined />}
              onClick={handleSearchLocation}
              loading={searchingLocation}
            >
              Buscar pelo nome da lavra
            </Button>
          </Space>

          {locationStatus === "not_found" && (
            <Typography.Text type="warning" style={{ display: "block", marginBottom: 8 }}>
              Nenhum resultado encontrado para &quot;{nomeLavra}&quot;.
            </Typography.Text>
          )}

          {locationResults.length > 0 && (
            <List
              size="small"
              bordered
              style={{ marginBottom: 12, maxHeight: 200, overflowY: "auto" }}
              dataSource={locationResults}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectLocation(item)}
                >
                  <EnvironmentOutlined style={{ marginRight: 8, color: "#1677ff" }} />
                  {item.display_name}
                </List.Item>
              )}
            />
          )}

          {searchingLocation && (
            <div style={{ marginBottom: 12 }}>
              <Spin size="small" /> <Typography.Text type="secondary"> Buscando...</Typography.Text>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Latitude:</label>
              <Controller
                name="latitude"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    value={field.value ?? undefined}
                    onChange={(val) => field.onChange(val ?? null)}
                    placeholder="-14.235"
                    style={inputFullStyle}
                    decimalSeparator="."
                    precision={7}
                    step={0.0000001}
                  />
                )}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Longitude:</label>
              <Controller
                name="longitude"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    value={field.value ?? undefined}
                    onChange={(val) => field.onChange(val ?? null)}
                    placeholder="-51.925"
                    style={inputFullStyle}
                    decimalSeparator="."
                    precision={7}
                    step={0.0000001}
                  />
                )}
              />
            </div>
          </div>
        </section>

        <Button type="primary" htmlType="submit">
          Atualizar
        </Button>
      </form>
    </div>
  );
};

export default EditMineradoraPage;
