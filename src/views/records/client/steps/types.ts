import { ICpfCnpj } from "@core/domain/types";

export interface PersonalData {
  cpfCnpj: ICpfCnpj;
  name: string;
  code: string;
}

export interface AddressData {
  cep: string;
  uf: string;
  city: number | null;
}

export interface Contact {
  mail: string;
  phone: string;
  contacts: number[];
}

export interface AdditionalData {
  type: string;
  status: string;
  avatar: string;
}

export interface ClienteData {
  personalData: PersonalData;
  addressData: AddressData;
  contact: Contact;
  additionalData: AdditionalData;
}
