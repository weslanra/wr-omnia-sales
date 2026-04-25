import useAuth from "@core/services/auth/useAuth";
import axios from "axios";
import defaultConfig from "../defaultConfig";

const axiosIns = axios.create({
  baseURL: defaultConfig.authService,
  headers: {
    "Content-Type": "application/json",
  },
});

const { auth } = useAuth(axiosIns, {});
export default auth;
