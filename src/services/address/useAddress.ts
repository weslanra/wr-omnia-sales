import useAuth from "@/services/auth/useAuth";
import useAddress from "@core/services/address/useAddress";
import axios from "axios";
import defaultConfig from "../defaultConfig";

const axiosIns = axios.create({
  baseURL: defaultConfig.addressService,
  headers: {
    "Content-Type": "application/json",
  },
});

const { address } = useAddress(axiosIns, useAuth, {});
export default address;
