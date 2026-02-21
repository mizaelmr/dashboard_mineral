import { cleanLowerValue } from "@/utils/cleanLowerValue";
import {
  stripDocument,
  formatCpf,
  formatCnpj,
  formatDocument,
} from "@/utils/documents";

export interface Contact {
  id: number;
  client_id: number;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Address {
  id: number;
  client_id: number;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type ClientType = 1 | 2;

export interface Client {
  id: number;
  tenant_id: number;
  type: ClientType;
  name: string;
  email: string | null;
  documentType: string;
  documentNumber: string | null;
  legalName: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  contact?: Contact | null;
  address?: Address | null;
}

export interface CreateAddressDto {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface CreateContactDto {
  phone?: string;
  mobile?: string;
  email?: string;
}

export interface CreateClientDto {
  type?: ClientType;
  name: string;
  email?: string;
  documentType: 'CPF' | 'CNPJ';
  documentNumber?: string;
  legalName?: string;
  address?: CreateAddressDto;
  contact?: CreateContactDto;
}

export interface UpdateClientDto {
  type?: ClientType;
  name?: string;
  email?: string;
  documentType?: 'CPF' | 'CNPJ';
  documentNumber?: string;
  legalName?: string;
  address?: CreateAddressDto;
  contact?: CreateContactDto;
}

export interface SearchClientDto {
  type?: ClientType;
  name?: string;
  documentNumber?: string;
}

export interface ClienteFormValues {
  nome: string;
  cpf: string;
  razaoSocial: string;
  cnpj: string;
  cep: string;
  endereco: string;
  complemento: string;
  bairro: string;
  numero: string;
  cidade: string;
  estado: string;
  cel: string;
  tel: string;
  email: string;
}

export interface ClienteTableRow {
  key: string;
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  celular: string;
}

export function mapClientToTableRow(client: Client): ClienteTableRow {
  return {
    key: client.id.toString(),
    id: client.id.toString(),
    nome: client.name,
    cpfCnpj: formatDocument(
      client.documentNumber,
      client.documentType === "CNPJ" ? "CNPJ" : "CPF"
    ),
    email: client.email || "",
    celular: client.contact?.mobile || "",
  };
}

export function mapFormValuesToCreateDto(
  formData: ClienteFormValues
): CreateClientDto {
  const hasCnpj = stripDocument(formData.cnpj).length > 0;

  const baseDto: CreateClientDto = hasCnpj
    ? {
        type: 1,
        name: cleanLowerValue(formData.nome) ?? "",
        email: cleanLowerValue(formData.email),
        documentType: "CNPJ",
        documentNumber: stripDocument(formData.cnpj) || undefined,
        legalName: cleanLowerValue(formData.razaoSocial),
      }
    : {
        type: 1,
        name: cleanLowerValue(formData.nome) ?? "",
        email: cleanLowerValue(formData.email),
        documentType: "CPF",
        documentNumber: stripDocument(formData.cpf) || undefined,
      };

  const addressData: CreateAddressDto = {};
  let hasAddress = false;

  const zip = cleanLowerValue(formData.cep);
  const street = cleanLowerValue(formData.endereco);
  const number = cleanLowerValue(formData.numero);
  const complement = cleanLowerValue(formData.complemento);
  const neighborhood = cleanLowerValue(formData.bairro);
  const city = cleanLowerValue(formData.cidade);
  const state = cleanLowerValue(formData.estado);

  if (zip) {
    addressData.zip = zip;
    hasAddress = true;
  }
  if (street) {
    addressData.street = street;
    hasAddress = true;
  }
  if (number) {
    addressData.number = number;
    hasAddress = true;
  }
  if (complement) {
    addressData.complement = complement;
    hasAddress = true;
  }
  if (neighborhood) {
    addressData.neighborhood = neighborhood;
    hasAddress = true;
  }
  if (city) {
    addressData.city = city;
    hasAddress = true;
  }
  if (state) {
    addressData.state = state;
    hasAddress = true;
  }

  if (hasAddress) {
    baseDto.address = addressData;
  }

  const contactData: CreateContactDto = {};
  let hasContact = false;

  const mobile = cleanLowerValue(formData.cel);
  const phone = cleanLowerValue(formData.tel);
  const contactEmail = cleanLowerValue(formData.email);

  if (mobile) {
    contactData.mobile = mobile;
    hasContact = true;
  }
  if (phone) {
    contactData.phone = phone;
    hasContact = true;
  }
  if (contactEmail) {
    contactData.email = contactEmail;
    hasContact = true;
  }

  if (hasContact) {
    baseDto.contact = contactData;
  }

  return baseDto;
}

export interface NewDeclarantePayload {
  nome: string;
  cpf: string;
  razaoSocial: string;
  cnpj: string;
  phoneNumber: string;
}

export function mapNewDeclaranteToCreateDto(
  data: NewDeclarantePayload
): CreateClientDto {
  const hasCnpj = stripDocument(data.cnpj).length > 0;
  const cpfDigits = stripDocument(data.cpf);
  const cnpjDigits = stripDocument(data.cnpj);
  const razaoSocial = cleanLowerValue(data.razaoSocial);

  const normalizedPhone = cleanLowerValue(data.phoneNumber);

  if (hasCnpj && cnpjDigits && razaoSocial) {
    return {
      type: 2,
      name: cleanLowerValue(data.nome) ?? razaoSocial ?? "",
      documentType: "CNPJ",
      documentNumber: cnpjDigits,
      legalName: razaoSocial,
      contact: normalizedPhone ? { mobile: normalizedPhone } : undefined,
    };
  }
  return {
    type: 2,
    name: cleanLowerValue(data.nome) ?? "",
    documentType: "CPF",
    documentNumber: cpfDigits,
    contact: normalizedPhone ? { mobile: normalizedPhone } : undefined,
  };
}

export function mapFormValuesToUpdateDto(
  formData: ClienteFormValues
): UpdateClientDto {
  const hasCnpj = stripDocument(formData.cnpj).length > 0;

  const baseDto: UpdateClientDto = hasCnpj
    ? {
        name: cleanLowerValue(formData.nome) ?? undefined,
        email: cleanLowerValue(formData.email),
        documentType: "CNPJ",
        documentNumber: stripDocument(formData.cnpj) || undefined,
        legalName: cleanLowerValue(formData.razaoSocial),
      }
    : {
        name: cleanLowerValue(formData.nome) ?? undefined,
        email: cleanLowerValue(formData.email),
        documentType: "CPF",
        documentNumber: stripDocument(formData.cpf) || undefined,
      };

  const addressData: CreateAddressDto = {
    zip: cleanLowerValue(formData.cep),
    street: cleanLowerValue(formData.endereco),
    number: cleanLowerValue(formData.numero),
    complement: cleanLowerValue(formData.complemento),
    neighborhood: cleanLowerValue(formData.bairro),
    city: cleanLowerValue(formData.cidade),
    state: cleanLowerValue(formData.estado),
  };

  baseDto.address = addressData;

  const contactData: CreateContactDto = {
    mobile: cleanLowerValue(formData.cel),
    phone: cleanLowerValue(formData.tel),
    email: cleanLowerValue(formData.email),
  };

  baseDto.contact = contactData;

  return baseDto;
}

export function mapClientToFormValues(client: Client): ClienteFormValues {
  const isCNPJ = client.documentType === 'CNPJ';
  const address = client.address;
  const contact = client.contact;

  return {
    nome: client.name || "",
    cpf: isCNPJ ? "" : formatCpf(client.documentNumber),
    razaoSocial: isCNPJ ? client.legalName || client.name : "",
    cnpj: isCNPJ ? formatCnpj(client.documentNumber) : "",
    cep: address?.zip || '',
    endereco: address?.street || '',
    complemento: address?.complement || '',
    bairro: address?.neighborhood || '',
    numero: address?.number || '',
    cidade: address?.city || '',
    estado: address?.state || '',
    cel: contact?.mobile || '',
    tel: contact?.phone || '',
    email: contact?.email || client.email || '',
  };
}
