import { z } from "zod";

function parseBrToNumber(value: string): number {
  return parseFloat(String(value).replace(/\./g, "").replace(",", ".")) || 0;
}

const positiveBrNumber = (msgRequired: string, msgPositive: string) =>
  z
    .string()
    .min(1, msgRequired)
    .refine((val) => parseBrToNumber(val) > 0, msgPositive);

export const certificadoFormSchema = z
  .object({
    cliente: z.string().min(1, "Cliente é obrigatório"),
    declarante: z.string(),
    mineradora: z.string().min(1, "Mineradora é obrigatória"),
    substancia: z.string().min(1, "Substância é obrigatória"),
    unidadeMedida: z.string().min(1, "Unidade de Medida é obrigatória"),
    categoria: z.string().min(1, "Categoria é obrigatória"),
    peso: positiveBrNumber("Peso é obrigatório", "Informe um peso maior que zero."),
    valorPorPeso: positiveBrNumber(
      "Valor por peso é obrigatório",
      "Informe um valor por peso maior que zero."
    ),
    valorTotal: positiveBrNumber(
      "Valor total é obrigatório",
      "Informe um valor total maior que zero."
    ),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    informacoesAdicionais: z.string(),
    descricaoImagem: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.declarante === "" || data.declarante === "new_declarante") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione um declarante ou use os dados do cliente.",
        path: ["declarante"],
      });
      return;
    }
    if (data.declarante === "same_as_client" && !data.cliente) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione o cliente primeiro para usar os dados como declarante.",
        path: ["declarante"],
      });
    }
  });

export type CertificadoFormSchema = z.infer<typeof certificadoFormSchema>;
