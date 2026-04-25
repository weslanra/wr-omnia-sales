import { AxiosInstance } from "axios";
import { IAuthService } from "../interfaces/auth/IAuthService";
import AddressService from "./addressService";

export default function useAddress(
  axiosIns: AxiosInstance,
  useAuth: IAuthService,
  authOverrideConfig: Object = {}
) {
  const address = new AddressService(axiosIns, useAuth, authOverrideConfig);

  return {
    address,
  };
}
