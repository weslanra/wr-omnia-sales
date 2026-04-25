// 👉 Company
export interface Company {
  id: number;
  cnpj: string;
  companyName: string;
  fantasyName: string;
  contact: string;
  email: string;
  active: boolean;
  paymentStatus: PaymentStatus;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: {
      id: number;
      name: string;
    };
    state: {
      id: number;
      name: string;
      abbreviation: string;
    };
    zipCode: string;
  };
}

export type PaymentStatus = "compliant" | "non-compliant";
