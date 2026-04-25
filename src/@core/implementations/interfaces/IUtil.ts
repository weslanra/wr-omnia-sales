export interface IBody {
  paginate?: boolean;
  draw?: number;
  start?: number;
  length?: number;
  search?: ITypeSearch;
  order?: Array<ITypeOrder>;
  columns?: Array<ITypeColumn>;
  firstRequest?: boolean;
  userdata?: any;
}

export type ITypeSearch = {
  value: string;
  regex?: boolean;
};

type ITypeOrder = {
  column?: number;
  dir: string;
  direcao?: number;
};

type ITypeColumn = {
  data: string;
  name?: string;
};

export interface IDefaultResponse {
  config: {
    adapter: Function;
    baseURL: string;
    data: string;
    headers: Object;
    maxBodyLength: number;
    maxContentLength: number;
    method: string;
    timeout: number;
    transformRequest: Function[];
    transformResponse: Function[];
    url: string;
    validateStatus: Function;
    xsrfCookieName: string;
    xsrfHeaderName: string;
  };
  data: any;
  headers: Object;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}

export interface IOption {
  label: string;
  value: any;
}

export interface IUserData {
  id: string;
  groupId: string;
  fullName: string;
  username: string;
  email: string;
  profileId: string;
  role: string;
  ehAdmin: boolean;
  ability: any[];
}
