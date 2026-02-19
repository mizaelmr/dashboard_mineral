"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { createPresident } from "../actions";
import { cleanLowerValue } from "@/utils/cleanLowerValue";

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: 24,
  borderRadius: 8,
  marginBottom: 24,
};

const inputFullStyle: React.CSSProperties = { width: "100%" };

const AddPresidentsPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [signatureS3Key, setSignatureS3Key] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      message.error("Nome é obrigatório.");
      return;
    }

    setSubmitting(true);
    try {
      await createPresident({
        name: cleanLowerValue(name) ?? "",
        signature_s3_key: signatureS3Key.trim() || undefined,
      });
      message.success("Presidente cadastrado com sucesso.");
      router.push("/presidentes");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao cadastrar presidente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Button
          type="default"
          htmlType="button"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/presidentes")}
        >
          Voltar
        </Button>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
          Novo Presidente
        </h1>
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
          Salvar
        </Button>
      </form>
    </div>
  );
};

export default AddPresidentsPage;
