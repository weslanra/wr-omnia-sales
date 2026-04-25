import { AxiosInstance, AxiosResponse } from "axios";

export interface IAuthService {
  configureInterceptorsAxiosInstance(axiosIns: AxiosInstance): void;
  getToken(): string | null;
  getRefreshToken(): string | null;
  getExpiresAt(): string | null;
  setToken(value: string): void;
  setRefreshToken(value: string): void;
  setExpiresAt(value: string): void;
  login(args: IBodyLogin): Promise<AxiosResponse<IResponseAuth>>;
  logout(): Promise<void>;
  refreshToken(): Promise<AxiosResponse<IResponseAuth>>;
}

export interface IAuthConfig {
  loginEndpoint: string;
  refreshEndpoint: string;
  tokenType: string;
  storageTokenKeyName: string;
  storageRefreshTokenKeyName: string;
  storageExpiresAtKeyName: string;
  storageUserDataName: string;
}

export type IBodyLogin = {
  user: string;
  password: string;
};

export interface IResponseAuth {
  token: string;
  expiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}
