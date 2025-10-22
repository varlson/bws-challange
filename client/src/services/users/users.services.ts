import { MakeRequest } from "../../config/axios/request";
import type { ListusersResponse, MeResponse } from "./users.models";

export const ListUsers = async () => {
  return await MakeRequest<ListusersResponse>({
    url: "v1/users/",
  });
};

export const GetMe = async () => {
  return await MakeRequest<MeResponse>({
    url: "me/",
  });
};
