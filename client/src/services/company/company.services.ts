import { MakeRequest } from "../../config/axios/request";
import type { CompanyResponse } from "./company.model";

export const listCompanies = async () => {
  return MakeRequest<CompanyResponse[]>({ url: "v1/companies" });
};
