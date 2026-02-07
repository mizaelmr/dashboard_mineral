import { z } from "zod";
import { stripDocument } from "@/utils/documents";

export const newDeclaranteFormSchema = z
  .object({
    nome: z.string(),
    cpf: z.string(),
    razaoSocial: z.string(),
    cnpj: z.string(),
  })
  .superRefine((data, ctx) => {
    const nome = data.nome?.trim() ?? "";
    const cpfDigits = stripDocument(data.cpf);
    const razaoSocial = data.razaoSocial?.trim() ?? "";
    const cnpjDigits = stripDocument(data.cnpj);

    const hasPerson = nome.length > 0 && cpfDigits.length === 11;
    const hasCompany = razaoSocial.length > 0 && cnpjDigits.length === 14;

    const hasAnyPerson = nome.length > 0 || cpfDigits.length > 0;
    const hasAnyCompany = razaoSocial.length > 0 || cnpjDigits.length > 0;

    if (hasPerson || hasCompany) {
      if (cpfDigits.length === 11 && nome.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome é obrigatório quando CPF é informado.",
          path: ["nome"],
        });
      }
      if (cnpjDigits.length === 14 && razaoSocial.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Razão social é obrigatória quando CNPJ é informado.",
          path: ["razaoSocial"],
        });
      }
      return;
    }

    if (hasAnyPerson || hasAnyCompany) {
      if (nome.length > 0 && cpfDigits.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CPF é obrigatório quando nome é informado.",
          path: ["cpf"],
        });
      }
      if (nome.length > 0 && cpfDigits.length > 0 && cpfDigits.length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CPF deve ter 11 dígitos.",
          path: ["cpf"],
        });
      if (cpfDigits.length === 11 && nome.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome é obrigatório quando CPF é informado.",
          path: ["nome"],
        });
      }
      if (razaoSocial.length > 0 && cnpjDigits.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CNPJ é obrigatório quando razão social é informada.",
          path: ["cnpj"],
        });
      }
      if (razaoSocial.length > 0 && cnpjDigits.length > 0 && cnpjDigits.length !== 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CNPJ deve ter 14 dígitos.",
          path: ["cnpj"],
        });
      }
      if (cnpjDigits.length === 14 && razaoSocial.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Razão social é obrigatória quando CNPJ é informado.",
          path: ["razaoSocial"],
        });
      }
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Preencha nome e CPF ou razão social e CNPJ.",
      path: ["nome"],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Preencha nome e CPF ou razão social e CNPJ.",
      path: ["razaoSocial"],
    });
  });

export type NewDeclaranteFormSchema = z.infer<typeof newDeclaranteFormSchema>;
