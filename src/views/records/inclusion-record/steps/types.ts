export interface AccountDetails {
  name: string;
  cnpj: string;
  phone: string;
  notification: {
    email: boolean;
    whatsapp: boolean;
    pushNotification: boolean;
  };
}

export interface DealType {
  Offer: string;
  discount: number | null;
  region: string | null;
}

export interface InclusionRecordData {
  accountDetails: AccountDetails;
  dealType: DealType;
}
