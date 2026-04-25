import { IAuthConfig } from "../interfaces/auth/IAuthService";

const authConfig: IAuthConfig = {
  // Endpoints
  loginEndpoint: "/login/autenticar",
  refreshEndpoint: "/login/refreshtoken",

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: "Bearer",

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "ApiToken-1",
  storageRefreshTokenKeyName: "refreshToken",
  storageExpiresAtKeyName: "expiresAtToken",

  // Valor da localStore com as informações do usuário
  storageUserDataName: "userData",
};

export default authConfig;
