// 👉 Point of sale
export interface PointOfSale {
  id: number;
  cnpj: string;
  companyName: string;
  fantasyName: string;
  contact: string;
  email: string;
  stateRegistration: string;
  municipalRegistration: string;
  active: boolean;
  companyId: number;
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
