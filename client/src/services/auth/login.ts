import { MakeRequest } from "../../config/axios/request";
import type { Credentials } from "../../types/types";

export type loginResponse = {
  detail: string;
  next?: string;
  user_id?: string;
};

export type towFactorAuthenticateResponse =
  | { detail: string }
  | { token: string; refreshToken: string; detail: string };

export const authenticate = async ({ email, password }: Credentials) => {
  return await MakeRequest<loginResponse>({
    method: "post",
    url: "login/",
    data: {
      email,
      password,
    },
  });
};

export const twoFactprAuthenticate = async (email: string, code: string) => {
  return await MakeRequest<loginResponse>({
    method: "post",
    url: "verify-2fa/",
    data: {
      email,
      code,
    },
  });
};
