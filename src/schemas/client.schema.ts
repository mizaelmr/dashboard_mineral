import { z } from 'zod';

export const clienteFormSchema = z
  .object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    cpf: z.string(),
    razaoSocial: z.string(),
    cnpj: z.string(),
    cep: z.string(),
    endereco: z.string(),
    complemento: z.string(),
    bairro: z.string(),
    numero: z.string(),
    cidade: z.string(),
    estado: z.string(),
    cel: z.string(),
    tel: z.string(),
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  })
  .superRefine((data, ctx) => {
    const cpf = data.cpf?.trim() || '';
    const cnpj = data.cnpj?.trim() || '';
    
    if (cpf.length === 0 && cnpj.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CPF ou CNPJ é obrigatório',
        path: ['cpf'],
      });
    }

    if (cnpj.length > 0) {
      const razaoSocial = data.razaoSocial?.trim() || '';
      if (razaoSocial.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Razão Social é obrigatória quando CNPJ é informado',
          path: ['razaoSocial'],
        });
      }
    }

    const cep = data.cep?.trim() || '';
    if (cep.length > 0) {
      const endereco = data.endereco?.trim() || '';
      const bairro = data.bairro?.trim() || '';
      const cidade = data.cidade?.trim() || '';
      const estado = data.estado?.trim() || '';

      if (endereco.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Endereço é obrigatório quando CEP é informado',
          path: ['endereco'],
        });
      }

      if (bairro.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bairro é obrigatório quando CEP é informado',
          path: ['bairro'],
        });
      }

      if (cidade.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cidade é obrigatória quando CEP é informado',
          path: ['cidade'],
        });
      }

      if (estado.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Estado é obrigatório quando CEP é informado',
          path: ['estado'],
        });
      }
    }

    const cel = data.cel?.trim() || '';
    const tel = data.tel?.trim() || '';
    if (cel.length === 0 && tel.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Celular ou Telefone é obrigatório',
        path: ['cel'],
      });
    }
  });

export type ClienteFormSchema = z.infer<typeof clienteFormSchema>;
