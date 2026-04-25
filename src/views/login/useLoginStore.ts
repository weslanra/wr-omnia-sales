import { LoginMockMeta } from "./types";

export const useLoginStore = defineStore("login", {
  state: () => ({
    credentials: {
      email: "",
      password: "",
    },
    mockMeta: {
      code: undefined
    } as LoginMockMeta
  }),
  actions: {
    setEmail(value: string) {
      this.credentials.email = value;
    },
    setMockMeta(value: LoginMockMeta) {
      this.mockMeta = value;
    },
  },
});
