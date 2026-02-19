"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import {
  A4Sheet,
  A4SheetContainer,
  BoxButtons,
  BoxButtonsActions,
  BoxData,
  BoxInfoCooperativa,
  BoxLabel,
  BoxLegalInfo,
  BoxLegalInfoText,
  BoxQrcodeImg,
  BoxSignature,
  BoxValue,
  BoxValueCooperativa,
  ContainerA4,
  DateAndTime,
  LabelAdditionalInfo,
  LabelCooperativa,
  LegalInfo,
  NameCooperativa,
  Signature,
  TextQrCode,
  TextQrCodeBold,
  ValueCooperativa,
} from "./styles";
import { getCertificateById, getStorageSignedUrl } from "../../actions";
import { getClientById } from "../../../clientes/actions";
import { getMandateById, getPresidentById } from "../../../presidentes/actions";
import { getMiningSiteById } from "../../../mineradoras/actions";
import { getProcessById } from "../../../processos/actions";
import { getAllLicenses } from "../../../licencas/actions";
import { mockDadosEmpresa } from "../../../dados-empresa/page";
import { capitalizeWords } from "@/utils/capitalize";
import { formatDocument } from "@/utils/documents";
import type { Client } from "@/types/client";

function formatClientAddress(client: Client | null): string {
  if (!client?.address) return "-";
  const a = client.address;
  const streetPart = [a.street, a.number].filter(Boolean).join(", ");
  const cityStatePart = [a.city, a.state].filter(Boolean).join(" / ");
  const parts = [
    streetPart ? capitalizeWords(streetPart) : "",
    a.complement ? capitalizeWords(a.complement) : "",
    a.neighborhood ? capitalizeWords(a.neighborhood) : "",
    cityStatePart ? capitalizeWords(cityStatePart) : "",
    a.zip ? `CEP ${a.zip}` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" - ") : "-";
}

function formatClientContact(client: Client | null): string {
  if (!client?.contact) return "-";
  const c = client.contact;
  return (c.mobile || c.phone || c.email || "-").trim() || "-";
}

function displayCapitalized(value: string): string {
  if (value == null || value.trim() === "" || value === "-") return value || "-";
  return capitalizeWords(value);
}

interface CertificadoDetalhes {
  nomeCooperativa: string;
  cnpjCooperativa: string;
  ieCooperativa: string;
  enderecoCooperativa: string;
  telefoneCooperativa: string;
  codigoVerificacao: string;
  numeroCertificado: string;
  nomeCliente: string;
  razaoSocial: string;
  cnpjCliente: string;
  contatoCliente: string;
  enderecoCliente: string;
  processoANM: string;
  mineracao: string;
  area: string;
  processosDNPM: string[];
  licencaAmbiental: string;
  dataLicenca: string;
  descricaoCaracterizacao: string;
  tipo: string;
  peso: string;
  informacoesAdicionais: string;
  nomeDeclarante: string;
  cpfDeclarante: string;
  nomePresidente: string;
  imageUrl?: string | null;
}

const ViewCertificadoPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [certificado, setCertificado] = useState<CertificadoDetalhes | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getCertificateById(Number(id))
      .then(async (cert) => {
        if (cancelled || !cert) return null;
        const [clientData, mandate, miningSite, licenses] = await Promise.all([
          getClientById(cert.client_id).catch(() => null),
          cert.mandateId ? getMandateById(cert.mandateId).catch(() => null) : Promise.resolve(null),
          cert.miningSiteId ? getMiningSiteById(cert.miningSiteId).catch(() => null) : Promise.resolve(null),
          getAllLicenses().catch(() => []),
        ]);
        const [president, process] = await Promise.all([
          mandate?.presidentId ? getPresidentById(mandate.presidentId).catch(() => null) : Promise.resolve(null),
          miningSite?.processId ? getProcessById(miningSite.processId).catch(() => null) : Promise.resolve(null),
        ]);
        let imageUrl: string | null = null;
        if (cert.imageS3Key) {
          try {
            imageUrl = await getStorageSignedUrl(cert.imageS3Key);
          } catch {
            imageUrl = null;
          }
        }
        const empresa = mockDadosEmpresa;
        const clientName = clientData ? capitalizeWords((clientData.name ?? "").trim()) : String(cert.client_id);
        const razaoSocial = clientData ? (clientData.legalName ? capitalizeWords((clientData.legalName ?? "").trim()) : clientName) : "-";
        const firstLicense = licenses.length > 0 ? licenses[0] : null;
        const pesoStr =
          cert.weight != null
            ? Number(cert.weight).toLocaleString("pt-BR", { minimumFractionDigits: 5 })
            : "";
        return {
          nomeCooperativa: empresa.nome,
          cnpjCooperativa: empresa.cnpj,
          ieCooperativa: empresa.ie,
          enderecoCooperativa: capitalizeWords([empresa.endereco, empresa.numero, empresa.bairro].filter(Boolean).join(", ") || "-"),
          telefoneCooperativa: empresa.fone1 || empresa.fone2 || "-",
          codigoVerificacao: cert.verificationCode ?? "-",
          numeroCertificado: cert.displayNumber ?? String(cert.id),
          nomeCliente: clientName,
          razaoSocial,
          cnpjCliente: clientData ? formatDocument(clientData.documentNumber, clientData.documentType as "CPF" | "CNPJ") || "-" : "-",
          contatoCliente: formatClientContact(clientData) !== "-" ? capitalizeWords(formatClientContact(clientData).trim()) : "-",
          enderecoCliente: formatClientAddress(clientData),
          processoANM: process?.number ?? "-",
          mineracao: miningSite ? capitalizeWords(miningSite.name) : "-",
          area: process?.hectares ?? "-",
          processosDNPM: process?.number ? [process.number] : [],
          licencaAmbiental: firstLicense ? capitalizeWords(firstLicense.name || firstLicense.code || "-") : "-",
          dataLicenca: firstLicense?.createdAt ? new Date(firstLicense.createdAt).toLocaleDateString("pt-BR") : "-",
          descricaoCaracterizacao: cert.description ? capitalizeWords(cert.description) : "-",
          tipo: cert.productType ? capitalizeWords(cert.productType) : "-",
          peso: pesoStr,
          informacoesAdicionais: cert.observation ? capitalizeWords(cert.observation) : "-",
          nomeDeclarante: clientName,
          cpfDeclarante: clientData ? formatDocument(clientData.documentNumber, clientData.documentType as "CPF" | "CNPJ") || "-" : "-",
          nomePresidente: president ? capitalizeWords(president.name ?? "") : "-",
          imageUrl,
        } as CertificadoDetalhes;
      })
      .then((data) => {
        if (!cancelled && data) setCertificado(data);
        else if (!cancelled) setCertificado(null);
      })
      .catch(() => {
        if (!cancelled) setCertificado(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);


  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Certificado de Origem - CMB",
  });

  const handlePdf = async () => {
    if (!componentRef.current) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(componentRef.current, {
      scale: 4,
      useCORS: true,
      logging: false,
      allowTaint: false,
    });

    const imgData = canvas.toDataURL("image/png", 1);
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(`Certificado_${certificado?.numeroCertificado || "CMB"}.pdf`);
  };

  const handleBack = () => {
    router.push("/certificados");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!certificado) {
    return (
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          Voltar
        </Button>
        <div>Certificado não encontrado</div>
      </div>
    );
  }

  return (
    <div>
      <BoxButtons>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Voltar
        </Button>
        <BoxButtonsActions>
          <Button type="primary" onClick={handlePrint}>
            Imprimir
          </Button>
          <Button type="primary" onClick={handlePdf}>
            PDF
          </Button>
        </BoxButtonsActions>
      </BoxButtons>

      <ContainerA4 >
        <A4SheetContainer
          ref={componentRef}
        >
          <A4Sheet>
            <Row gutter={20} style={{ marginBottom: 12, alignItems: "center", display: "flex", flexWrap: "nowrap" }}>
              <Col xs={24} md={6} style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ width: 120, height: 48, backgroundColor: "#e8e8e8", borderRadius: 4 }} />
              </Col>
              <Col xs={24} md={10} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <NameCooperativa style={{ marginBottom: 2 }}>{certificado.nomeCooperativa}</NameCooperativa>
                <BoxValueCooperativa style={{ justifyContent: "center" }}>
                  <ValueCooperativa>{certificado.cnpjCooperativa} - I.E: {certificado.ieCooperativa}</ValueCooperativa>
                </BoxValueCooperativa>
                <BoxValueCooperativa style={{ justifyContent: "center" }}>
                  <ValueCooperativa>{certificado.enderecoCooperativa}</ValueCooperativa>
                </BoxValueCooperativa>
                <BoxValueCooperativa style={{ justifyContent: "center" }}>
                  <ValueCooperativa>{certificado.telefoneCooperativa}</ValueCooperativa>
                </BoxValueCooperativa>
              </Col>
              <Col xs={24} md={8} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                <BoxQrcodeImg>
                  <Image src="/qrcode.png" alt="QR Code" width={64} height={64} unoptimized />
                </BoxQrcodeImg>
                <TextQrCode style={{ marginTop: 2 }}>{certificado.numeroCertificado}</TextQrCode>
                <TextQrCodeBold>{certificado.codigoVerificacao}</TextQrCodeBold>
              </Col>
            </Row>

            <Row gutter={20} style={{ alignItems: "flex-start", marginBottom: 10 }}>
              <Col xs={24} md={14}>
                <BoxData>
                  <BoxLabel>Nome / Name:</BoxLabel>
                  <BoxValue>{displayCapitalized(certificado.nomeCliente)}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>Razão Social / Social Reason:</BoxLabel>
                  <BoxValue>{displayCapitalized(certificado.razaoSocial)}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>CNPJ:</BoxLabel>
                  <BoxValue>{certificado.cnpjCliente}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>Contato / Contact:</BoxLabel>
                  <BoxValue>{displayCapitalized(certificado.contatoCliente)}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>Endereço / Address:</BoxLabel>
                  <BoxValue>{displayCapitalized(certificado.enderecoCliente)}</BoxValue>
                </BoxData>
              </Col>
              <Col xs={24} md={10}>
                <BoxData>
                  <BoxLabel>Extração Mineral - Certificado de Origem</BoxLabel>
                  <BoxValue>&nbsp;</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>PLGs:</BoxLabel>
                  <BoxValue>{displayCapitalized("Permissão de Lavra Garimpeira")}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>Processos Dnpm:</BoxLabel>
                  <BoxValue>{certificado.processosDNPM.length > 0 ? certificado.processosDNPM.join(", ") : "-"}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>Licença Ambiental:</BoxLabel>
                  <BoxValue>{displayCapitalized(certificado.licencaAmbiental)}{certificado.dataLicenca ? ` - ${certificado.dataLicenca}` : ""}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>Processo / Process ANM Nº:</BoxLabel>
                  <BoxValue>{certificado.processoANM}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>Mineração / Mining:</BoxLabel>
                  <BoxValue>{displayCapitalized(certificado.mineracao)}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>Área / Area - ha:</BoxLabel>
                  <BoxValue>{certificado.area}</BoxValue>
                </BoxData>
              </Col>
            </Row>

            <div style={{ marginBottom: 10 }}>
              <Row gutter={12}>
                <Col span={12}>
                  <BoxData>
                    <BoxLabel>Descrição / Caracterização:</BoxLabel>
                    <BoxValue>{displayCapitalized(certificado.descricaoCaracterizacao)}</BoxValue>
                  </BoxData>
                </Col>
                <Col span={6}>
                  <BoxData>
                    <BoxLabel>Tipo / Type:</BoxLabel>
                    <BoxValue style={{ color: "#c41d1d", fontWeight: 700, fontSize: 14 }}>{certificado.tipo}</BoxValue>
                  </BoxData>
                </Col>
                <Col span={6}>
                  <BoxData>
                    <BoxLabel>Peso / Weight: Kg:</BoxLabel>
                    <BoxValue>{certificado.peso}</BoxValue>
                  </BoxData>
                </Col>
              </Row>
              {certificado.informacoesAdicionais && certificado.informacoesAdicionais.trim() !== "" && certificado.informacoesAdicionais !== "-" && (
                <BoxData>
                  <BoxLabel>Informações adicionais / Additional information:</BoxLabel>
                  <BoxValue>{displayCapitalized(certificado.informacoesAdicionais)}</BoxValue>
                </BoxData>
              )}
              <BoxValue style={{ fontSize: 12, color: "#595959", marginTop: 4 }}>
                As informações acima relatadas, são de inteira responsabilidade do declarante, devido à cooperativa não possuir um Técnico Avaliador.
              </BoxValue>
            </div>

            <LabelAdditionalInfo style={{ marginBottom: 6 }}>Anexo</LabelAdditionalInfo>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
              {certificado.imageUrl ? (
                <img src={certificado.imageUrl} alt="Anexo" style={{ maxWidth: 220, maxHeight: 165, objectFit: "contain" }} />
              ) : (
                <div style={{ width: 160, height: 120, backgroundColor: "#e8e8e8", borderRadius: 4 }} />
              )}
            </div>

            <Row gutter={24} style={{ marginTop: 20 }}>
              <Col span={8}>
                <BoxSignature>
                  <Signature>Declarante</Signature>
                  <Signature>{displayCapitalized(certificado.nomeDeclarante)}</Signature>
                  <Signature>{certificado.cpfDeclarante}</Signature>
                </BoxSignature>
              </Col>
              <Col span={8}>
                <BoxSignature>
                  <Signature>Presidente</Signature>
                  <Signature>{displayCapitalized(certificado.nomePresidente)}</Signature>
                </BoxSignature>
              </Col>
              <Col span={8}>
                <BoxSignature>
                  <Signature>Emissor</Signature>
                  <Signature />
                </BoxSignature>
              </Col>
            </Row>

            <BoxLegalInfo>
              <BoxLegalInfoText>
                <LegalInfo>Informações:</LegalInfo> BASE LEGAL: Circulação, Impostos e Taxas
              </BoxLegalInfoText>
              <LegalInfo>
                &quot;Valor aproximado correspondente à totalidade dos tributos federais, estaduais e municipais e taxa da CMB, em conformidade com o disposto na Lei nº 12741/2012: 12,90%&quot;
              </LegalInfo>
              <LegalInfo style={{ marginBottom: 4 }}>
                Consulta de autenticidade do Certificado de origem informando o código de verificação através do site{" "}
                <span style={{ textDecoration: "underline" }}>www.cooperativacmb.com.br</span>
              </LegalInfo>
              <DateAndTime>
                {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })}{" "}
                {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </DateAndTime>
            </BoxLegalInfo>
          </A4Sheet>
        </A4SheetContainer>
      </ContainerA4>
    </div>
  );
};

export default ViewCertificadoPage;
