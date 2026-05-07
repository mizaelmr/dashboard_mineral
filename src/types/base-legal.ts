export interface BaseLegal {
  id: number;
  tenant_id?: number;
  content: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseLegalContent {
  title: string;
  description: string;
  siteUrl: string;
  showSubstanceTaxes: boolean;
}

export const DEFAULT_BASE_LEGAL: BaseLegalContent = {
  title: "Informações: BASE LEGAL: Circulação, Impostos e Taxas",
  description:
    '"Valor aproximado correspondente à totalidade dos tributos federais, estaduais e municipais e taxa da cooperativa, em conformidade com o disposto na Lei nº 12741/2012: 12,90%"\nConsulta de autenticidade do Certificado de origem informando o código de verificação através do site',
  siteUrl: "www.cooperativacmb.com.br",
  showSubstanceTaxes: false,
};

export function parseBaseLegalContent(content: string | null): BaseLegalContent | null {
  if (!content || typeof content !== "string") return null;
  try {
    const parsed = JSON.parse(content) as Partial<BaseLegalContent> & {
      informacoes?: string;
      valorAproximado?: string;
      consultaSite?: string;
    };
    if (
      typeof parsed.title === "string" &&
      typeof parsed.description === "string" &&
      typeof parsed.siteUrl === "string" &&
      typeof parsed.showSubstanceTaxes === "boolean"
    ) {
      return parsed as BaseLegalContent;
    }
    if (
      typeof parsed.informacoes === "string" &&
      typeof parsed.valorAproximado === "string" &&
      typeof parsed.consultaSite === "string" &&
      typeof parsed.siteUrl === "string"
    ) {
      return {
        title: parsed.informacoes,
        description: `${parsed.valorAproximado}\n${parsed.consultaSite}`,
        siteUrl: parsed.siteUrl,
        showSubstanceTaxes: false,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function stringifyBaseLegalContent(data: BaseLegalContent): string {
  return JSON.stringify(data);
}
