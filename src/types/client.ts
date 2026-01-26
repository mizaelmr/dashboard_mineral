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

export interface Client {
  id: number;
  tenant_id: number;
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
  name: string;
  email?: string;
  documentType: 'CPF' | 'CNPJ';
  documentNumber?: string;
  legalName?: string;
  address?: CreateAddressDto;
  contact?: CreateContactDto;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  documentType?: 'CPF' | 'CNPJ';
  documentNumber?: string;
  legalName?: string;
  address?: CreateAddressDto;
  contact?: CreateContactDto;
}

export interface SearchClientDto {
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
    cpfCnpj: client.documentNumber || '',
    email: client.email || '',
    celular: client.contact?.mobile || '',
  };
}

function cleanValue(value: string | undefined): string | undefined {
  if (!value || value.trim() === '' || value === '$undefined') {
    return undefined;
  }
  return value.trim();
}

export function mapFormValuesToCreateDto(
  formData: ClienteFormValues
): CreateClientDto {
  const hasCnpj = formData.cnpj && formData.cnpj.trim() !== '';

  const baseDto: CreateClientDto = hasCnpj
    ? {
        name: formData.nome.trim(),
        email: cleanValue(formData.email),
        documentType: 'CNPJ',
        documentNumber: cleanValue(formData.cnpj),
        legalName: cleanValue(formData.razaoSocial),
      }
    : {
        name: formData.nome.trim(),
        email: cleanValue(formData.email),
        documentType: 'CPF',
        documentNumber: cleanValue(formData.cpf),
      };

  const addressData: CreateAddressDto = {};
  let hasAddress = false;

  const zip = cleanValue(formData.cep);
  const street = cleanValue(formData.endereco);
  const number = cleanValue(formData.numero);
  const complement = cleanValue(formData.complemento);
  const neighborhood = cleanValue(formData.bairro);
  const city = cleanValue(formData.cidade);
  const state = cleanValue(formData.estado);

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

  const mobile = cleanValue(formData.cel);
  const phone = cleanValue(formData.tel);
  const contactEmail = cleanValue(formData.email);

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

export function mapFormValuesToUpdateDto(
  formData: ClienteFormValues
): UpdateClientDto {
  const hasCnpj = formData.cnpj && formData.cnpj.trim() !== '';

  const baseDto: UpdateClientDto = hasCnpj
    ? {
        name: formData.nome.trim(),
        email: cleanValue(formData.email),
        documentType: 'CNPJ',
        documentNumber: cleanValue(formData.cnpj),
        legalName: cleanValue(formData.razaoSocial),
      }
    : {
        name: formData.nome.trim(),
        email: cleanValue(formData.email),
        documentType: 'CPF',
        documentNumber: cleanValue(formData.cpf),
      };

  const addressData: CreateAddressDto = {
    zip: cleanValue(formData.cep) || null,
    street: cleanValue(formData.endereco) || null,
    number: cleanValue(formData.numero) || null,
    complement: cleanValue(formData.complemento) || null,
    neighborhood: cleanValue(formData.bairro) || null,
    city: cleanValue(formData.cidade) || null,
    state: cleanValue(formData.estado) || null,
  };

  baseDto.address = addressData;

  const contactData: CreateContactDto = {
    mobile: cleanValue(formData.cel) || null,
    phone: cleanValue(formData.tel) || null,
    email: cleanValue(formData.email) || null,
  };

  baseDto.contact = contactData;

  return baseDto;
}

export function mapClientToFormValues(client: Client): ClienteFormValues {
  const isCNPJ = client.documentType === 'CNPJ';
  const address = client.address;
  const contact = client.contact;

  return {
    nome: client.name || '',
    cpf: isCNPJ ? '' : client.documentNumber || '',
    razaoSocial: isCNPJ ? client.legalName || client.name : '',
    cnpj: isCNPJ ? client.documentNumber || '' : '',
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
