import { AxiosInstance, AxiosResponse } from "axios";
import {
  IAddressConfig,
  IAddressService,
  ICity,
} from "../interfaces/address/IAddressService";
import { IAuthService } from "../interfaces/auth/IAuthService";
import addressDefaultConfig from "./addressDefaultConfig";

export default class AddressService implements IAddressService {
  useAuth: IAuthService;
  axiosIns: AxiosInstance;
  serviceConfig: IAddressConfig;

  constructor(
    axiosIns: AxiosInstance,
    useAuth: IAuthService,
    overrideConfig: Object
  ) {
    this.axiosIns = axiosIns;
    this.serviceConfig = { ...addressDefaultConfig, ...overrideConfig };
    this.useAuth = useAuth;

    this.useAuth.configureInterceptorsAxiosInstance(this.axiosIns);
  }

  requestGetCities(uf: string): Promise<AxiosResponse<ICity[]>> {
    return this.axiosIns.get(this.serviceConfig.getCitiesEndpoint + `uf=${uf}`);
  }
}
