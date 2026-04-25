import { AxiosResponse } from "axios";

export interface IAddressService {
  requestGetCities(stateId: string): Promise<AxiosResponse<unknown>>;
}

export interface IAddressConfig {
  getCitiesEndpoint: string;
}

export interface ICity {
  id: string;
  nome: string;
  estado: string;
  uf: string;
}
