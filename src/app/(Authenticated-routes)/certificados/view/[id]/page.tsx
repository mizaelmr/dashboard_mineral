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
  BoxButtons
  , BoxButtonsActions,
  BoxData,
  BoxInfoCooperativa
  , BoxLabel, BoxLegalInfo,
  BoxLegalInfoText, BoxQrcodeImg, BoxSignature,
  BoxValue,
  BoxValueCooperativa,
  CertificateQrcode,
  ContainerA4,
  DataQrCode,
  DateAndTime,
  LabelAdditionalInfo,
  LabelCooperativa,
  LegalInfo,
  NameCooperativa,
  Signature,
  TextQrCode,
  TextQrCodeBold,
  ValueCooperativa
} from "./styles";

interface Certificado {
  key: string;
  id: string;
  cliente: string;
  descricao: string;
  dataGerada: string;
  valor: string;
}

interface CertificadoDetalhes {
  // Informações da Cooperativa
  cnpjCooperativa: string;
  ieCooperativa: string;
  enderecoCooperativa: string;
  telefoneCooperativa: string;
  codigoVerificacao: string;
  numeroCertificado: string;

  // Informações do Declarante/Cliente
  nomeCliente: string;
  razaoSocial: string;
  cnpjCliente: string;
  contatoCliente: string;

  // Informações de Endereço e Processo
  enderecoCliente: string;
  processoANM: string;
  mineracao: string;
  area: string;

  // Informações do Certificado
  processosDNPM: string[];
  licencaAmbiental: string;
  dataLicenca: string;

  // Informações da Licença
  descricaoCaracterizacao: string;
  tipo: string;
  peso: string;
  informacoesAdicionais: string;

  // Informações do Declarante
  nomeDeclarante: string;
  cpfDeclarante: string;

  // Informações do Presidente
  nomePresidente: string;
}

// Dados de exemplo (mesmos da lista de certificados)
const mockCertificados: Certificado[] = [
  {
    key: "1",
    id: "3186",
    cliente: "TIME INVEST ADMINISTRAÇÃO E PARTICIPAÇÕES EIRELI-ME",
    descricao: "CANGA DE ESMERALDA",
    dataGerada: "2026-01-21 15:48:37",
    valor: "R$ 6.000,00",
  },
  {
    key: "2",
    id: "3185",
    cliente: "YUSO ANTÔNIO VIEIRA COSTA",
    descricao: "ESMERALDA BRUTA",
    dataGerada: "2026-01-15 14:05:11",
    valor: "R$ 1.260,00",
  },
  {
    key: "3",
    id: "3184",
    cliente: "RICARDO NAZARENO CAMPELO SIQUEIRA",
    descricao: "ESMERALDA BRUTA",
    dataGerada: "2026-01-14 14:31:35",
    valor: "R$ 1.000,00",
  },
  {
    key: "4",
    id: "3183",
    cliente: "LEONARDO DA SILVA GOMES",
    descricao: "ESMERALDA BRUTA",
    dataGerada: "2026-01-14 14:07:51",
    valor: "R$ 496,00",
  },
];

// Função para buscar dados completos do certificado (simular API)
const fetchCertificadoDetalhes = (id: string): CertificadoDetalhes | null => {
  const certificado = mockCertificados.find((c) => c.id === id);
  if (!certificado) return null;

  // Simular dados completos
  return {
    cnpjCooperativa: "08.020.967/0001-47",
    ieCooperativa: "69.031.374-NO",
    enderecoCooperativa: "RUA PETROLINA, 215, SERRA DA CARNAIBA - PINDOBAÇU - BA Pindobaçu / BA - 44770-000",
    telefoneCooperativa: "(74) 99961-1561",
    codigoVerificacao: "6973885c50dc3",
    numeroCertificado: "3189/2026",
    nomeCliente: certificado.cliente || "QUARTZO CAMPO FORMOSO EIRELI",
    razaoSocial: "QUARTZO CAMPO FORMOSO EIRELI",
    cnpjCliente: "30.777.096/0001-60",
    contatoCliente: "-",
    enderecoCliente: "RUA JAGUARARI, 70, Campo Formoso / BA 44790-000",
    processoANM: "871.861/2006",
    mineracao: "MINAS DIVERSAS (871.861/2006)",
    area: "923,25",
    processosDNPM: ["871.860/2006", "871.861/2006", "873.335/2006"],
    licencaAmbiental: "INEMA 499 D.O.E",
    dataLicenca: "01/07/2011",
    descricaoCaracterizacao: certificado.descricao || "CASCALHO DE ESMERALDA",
    tipo: "D",
    peso: "10.000,00000",
    informacoesAdicionais: certificado.descricao || "CASCALHO DE ESMERALDA",
    nomeDeclarante: "CESAR WELLINGTON MONTEIRO DE MENEZES",
    cpfDeclarante: "237.573.105-00",
    nomePresidente: "Humberto Alves de Meneses",
  };
};

const ViewCertificadoPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [certificado, setCertificado] = useState<CertificadoDetalhes | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCertificado = () => {
      setLoading(true);
      const certificadoData = fetchCertificadoDetalhes(id);
      setCertificado(certificadoData || null);
      setLoading(false);
    };

    if (id) {
      loadCertificado();
    }
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
            {/* Header */}
            <Row gutter={16}>
              {/* Logo e Nome da Cooperativa */}
              <Col span={8}>
                <Image src="/logo_cmb.png" alt="Logo da Cooperativa" width={200} height={80} unoptimized />
              </Col>

              {/* Informações da Cooperativa */}
              <Col span={12}>
                <BoxInfoCooperativa>
                  <NameCooperativa>
                    COOPERATIVA MINERAL DA BAHIA
                  </NameCooperativa>
                  <BoxValueCooperativa>
                    <LabelCooperativa>CNPJ:</LabelCooperativa>
                    <ValueCooperativa>{certificado.cnpjCooperativa} - I.E: {certificado.ieCooperativa}</ValueCooperativa>
                  </BoxValueCooperativa>
                  <BoxValueCooperativa>
                    <LabelCooperativa>Endereço:</LabelCooperativa>
                    <ValueCooperativa>{certificado.enderecoCooperativa}</ValueCooperativa>
                  </BoxValueCooperativa>
                  <BoxValueCooperativa>
                    <LabelCooperativa>Telefone:</LabelCooperativa>
                    <ValueCooperativa>{certificado.telefoneCooperativa}</ValueCooperativa>
                  </BoxValueCooperativa>
                </BoxInfoCooperativa>
              </Col>

              {/* QR Code no Header */}
              <Col span={4}>
                <BoxQrcodeImg>
                  <Image src="/qrcode.png" alt="QR Code" width={100} height={100} unoptimized />
                </BoxQrcodeImg>
                <TextQrCode>
                  {certificado.numeroCertificado}
                </TextQrCode>
                <TextQrCodeBold>
                  {certificado.codigoVerificacao}
                </TextQrCodeBold>
              </Col>
            </Row>

            {/* Conteúdo Principal - Três Colunas */}
            <Row gutter={12} style={{ marginBottom: 20 }}>
              {/* Coluna Esquerda - Dados do Cliente */}
              <Col span={10}>
                <BoxData>
                  <BoxLabel>NOME/NAME:</BoxLabel>
                  <BoxValue>{certificado.nomeCliente}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>RAZÃO SOCIAL/SOCIAL REASON:</BoxLabel>
                  <BoxValue>{certificado.razaoSocial}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>CNPJ:</BoxLabel>
                  <BoxValue>{certificado.cnpjCliente}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>CONTATO/CONTACT:</BoxLabel>
                  <BoxValue>{certificado.contatoCliente}</BoxValue>
                </BoxData>
              </Col>

              {/* Coluna Meio - Endereço e Processo */}
              <Col span={10}>
                <BoxData>
                  <BoxLabel>ENDEREÇO/ADDRESS:</BoxLabel>
                  <BoxValue>{certificado.enderecoCliente}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>PROCESSO/PROCESS ANM N°:</BoxLabel>
                  <BoxValue>{certificado.processoANM}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>MINERAÇÃO/MINING:</BoxLabel>
                  <BoxValue>{certificado.mineracao}</BoxValue>
                </BoxData>
                <BoxData>
                  <BoxLabel>ÁREA/AREA - ha:</BoxLabel>
                  <BoxValue>{certificado.area}</BoxValue>
                </BoxData>
              </Col>

              {/* Coluna Direita - Certificado de Origem */}
              <Col span={4}>
                <CertificateQrcode>
                  Extração Mineral CERTIFICADO DE ORIGEM
                </CertificateQrcode>
                <DataQrCode>
                  PLGs - Permissão de Lavra Garimpeira
                </DataQrCode>
                <CertificateQrcode >
                  Processos DNPM:
                </CertificateQrcode>
                {certificado.processosDNPM.map((processo, index) => (
                  <DataQrCode key={index}>
                    {processo}
                  </DataQrCode>
                ))}
                <CertificateQrcode>
                  LICENÇA AMBIENTAL:
                </CertificateQrcode>
                <DataQrCode >
                  {certificado.licencaAmbiental}
                </DataQrCode>
                <DataQrCode>
                  {certificado.dataLicenca}
                </DataQrCode>
              </Col>
            </Row>


            {/* Seção Licença */}
            <div>
              <LabelAdditionalInfo>
                Licença
              </LabelAdditionalInfo>
              <Row gutter={12}>
                <Col span={12}>
                  <BoxData>
                    <BoxLabel>Descrição / Caracterização:</BoxLabel>
                    <BoxValue>{certificado.descricaoCaracterizacao}</BoxValue>
                  </BoxData>
                </Col>
                <Col span={6}>
                  <BoxData>
                    <BoxLabel>Tipo:</BoxLabel>
                    <BoxValue style={{ color: "#ff4d4f", fontWeight: 700, fontSize: "14px", justifyContent: "center" }}>
                      {certificado.tipo}
                    </BoxValue>
                  </BoxData>
                </Col>
                <Col span={6}>
                  <BoxData>
                    <BoxLabel>Peso: Kg</BoxLabel>
                    <BoxValue>{certificado.peso}</BoxValue>
                  </BoxData>
                </Col>
              </Row>
              <BoxData>
                <BoxLabel>Informações adicionais:</BoxLabel>
                <BoxValue>{certificado.informacoesAdicionais}</BoxValue>
              </BoxData>
              <BoxValue>
                As informações acima relatadas, são de inteira responsabilidade do declarante, devido a CMB não possuir um Técnico Avaliador.
              </BoxValue>
            </div>

            {/* Anexo */}
            <LabelAdditionalInfo style={{ marginBottom: 10 }}>Anexo</LabelAdditionalInfo>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Image src="/esmelrada.jpg" alt="Anexo" width={200} height={180} unoptimized style={{ height: 180, width: "auto" }} />
            </div>

            {/* Assinaturas */}
            <Row gutter={20} style={{ marginTop: 60 }}>
              <Col span={8}>
                <BoxSignature>
                  <Signature>Declarante</Signature>
                  <Signature>{certificado.nomeDeclarante}</Signature>
                  <Signature>{certificado.cpfDeclarante}</Signature>
                </BoxSignature>
              </Col>
              <Col span={8}>
                <BoxSignature>
                  <Signature>Presidente</Signature>
                  <Signature>{certificado.nomePresidente}</Signature>
                </BoxSignature>
              </Col>
              <Col span={8}>
                <BoxSignature>
                  <Signature>Emissor</Signature>
                  <Signature />
                </BoxSignature>
              </Col>
            </Row>

            {/* Footer - Informações Legais */}
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
