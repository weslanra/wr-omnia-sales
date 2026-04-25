import {
  IAuthConfig,
  IAuthService,
  IResponseAuth,
} from "@core/services/interfaces/auth/IAuthService";
import { AxiosInstance, AxiosResponse } from "axios";
import { IUserData } from "../interfaces/IUtil";
import authDefaultConfig from "./authDefaultConfig";

export default class AuthService implements IAuthService {
  axiosIns: AxiosInstance;
  serviceConfig: IAuthConfig;

  // For Refreshing Token
  isAlreadyFetchingAccessToken: boolean;

  // For Refreshing Token
  subscribers: Array<Function>;
  offSubscribers: Array<Function>;

  constructor(axiosIns: AxiosInstance, authOverrideConfig: Object) {
    this.axiosIns = axiosIns;
    this.serviceConfig = { ...authDefaultConfig, ...authOverrideConfig };
    this.isAlreadyFetchingAccessToken = false;
    this.subscribers = [];
    this.offSubscribers = [];

    this.configureInterceptorsAxiosInstance(this.axiosIns);
  }

  configureInterceptorsAxiosInstance(axiosIns: AxiosInstance) {
    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const accessToken = this.getToken();

        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.serviceConfig.tokenType} ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      (response) => response,
      (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;

            this.refreshToken()
              .then((r: AxiosResponse<IResponseAuth>) => {
                this.isAlreadyFetchingAccessToken = false;
                // Update accessToken in localStorage
                this.setToken(r.data.token);
                this.setRefreshToken(r.data.refreshToken);
                this.setExpiresAt(r.data.expiresAt);

                this.onAccessTokenFetched(r.data.token);
              })
              .catch(() => {
                this.offAccessTokenFetched();

                this.logout({
                  sessaoExpirada: true,
                });
              });
          }

          const retryOriginalRequest = new Promise((resolve, reject) => {
            this.addSubscriber((accessToken: string) => {
              // Make sure to assign accessToken according to your response.
              // Check: https://pixinvent.ticksy.com/ticket/2413870
              // Change Authorization header
              originalRequest.headers.Authorization = `${this.serviceConfig.tokenType} ${accessToken}`;
              resolve(this.axiosIns(originalRequest));
            });

            this.addOffSubscriber(() => {
              reject(error);
            });
          });

          return retryOriginalRequest;
        }

        return Promise.reject(error);
      },
    );
  }

  onAccessTokenFetched(accessToken: string): void {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken),
    );
  }

  offAccessTokenFetched(): void {
    this.offSubscribers = this.offSubscribers.filter((callback) => callback());
  }

  addSubscriber(callback: Function): void {
    this.subscribers.push(callback);
  }

  addOffSubscriber(callback: Function): void {
    this.offSubscribers.push(callback);
  }

  logout(payload?: object): Promise<void> {
    return new Promise((resolve) => {
      const logoutEvento = new CustomEvent("logout", {
        detail: payload,
      });

      document.dispatchEvent(logoutEvento);
      resolve();
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.serviceConfig.storageTokenKeyName);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.serviceConfig.storageRefreshTokenKeyName);
  }

  getExpiresAt(): string | null {
    return localStorage.getItem(this.serviceConfig.storageExpiresAtKeyName);
  }

  getCurrentUser(): IUserData | null {
    const currentUser: IUserData | null = JSON.parse(
      localStorage.getItem("userData") || "null",
    );

    return currentUser;
  }

  setToken(token: string): void {
    localStorage.setItem(this.serviceConfig.storageTokenKeyName, token);
  }

  setRefreshToken(value: string): void {
    localStorage.setItem(this.serviceConfig.storageRefreshTokenKeyName, value);
  }

  setExpiresAt(value: string): void {
    localStorage.setItem(this.serviceConfig.storageExpiresAtKeyName, value);
  }

  login(args: {
    user: string;
    password: string;
    company?: string;
  }): Promise<AxiosResponse<IResponseAuth>> {
    return this.axiosIns.post(this.serviceConfig.loginEndpoint, args);
  }

  refreshToken(): Promise<AxiosResponse<IResponseAuth>> {
    return this.axiosIns.post(this.serviceConfig.refreshEndpoint, {
      token: this.getToken(),
      expiresAt: this.getExpiresAt(),
      refreshToken: this.getRefreshToken(),
    });
  }
}
