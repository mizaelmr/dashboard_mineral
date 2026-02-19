"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { getPresidentById, updatePresident } from "../../actions";
import { cleanLowerValue } from "@/utils/cleanLowerValue";

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const EditPresidentsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id as string);

  const [name, setName] = useState("");
  const [signatureS3Key, setSignatureS3Key] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    queueMicrotask(() => setLoading(true));
    getPresidentById(id)
      .then((president) => {
        if (!cancelled && president) {
          setName(president.name ?? "");
          setSignatureS3Key(president.signatureS3Key ?? "");
        }
      })
      .catch(() => {
        if (!cancelled) {
          message.error("Falha ao carregar presidente.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      message.error("Nome é obrigatório.");
      return;
    }

    setSubmitting(true);
    try {
      await updatePresident(id, {
        name: cleanLowerValue(name) ?? "",
        signature_s3_key: signatureS3Key.trim() || null,
      });
      message.success("Presidente atualizado com sucesso.");
      router.push("/presidentes");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao atualizar presidente."
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
            onClick={() => router.push("/presidentes")}
          >
            Voltar
          </Button>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
            Editar Presidente
          </h1>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <section style={sectionStyle}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: 4 }}>
              *Nome
            </label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Digite o nome do presidente"
              style={inputFullStyle}
            />
          </div>

          <div>
            <label htmlFor="signatureS3Key" style={{ display: "block", marginBottom: 4 }}>
              Chave S3 da assinatura
            </label>
            <Input
              id="signatureS3Key"
              value={signatureS3Key}
              onChange={(event) => setSignatureS3Key(event.target.value)}
              placeholder="signatures/president-name.png"
              style={inputFullStyle}
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

export default EditPresidentsPage;
