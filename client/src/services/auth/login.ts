import { MakeRequest } from "../../config/axios/request";
import type { Credentials } from "../../types/types";

export type LoginResponse = {
  detail: string;
  access: string;
};

export type towFactorAuthenticateResponse =
  | { detail: string }
  | { token: string; refreshToken: string; detail: string };

export const authenticate = async ({ email, password }: Credentials) => {
  return await MakeRequest<LoginResponse>({
    method: "post",
    url: "login/",
    data: {
      email,
      password,
    },
  });
};

export const codeConfirmation = async (
  email: string,
  code: string,
  isEmailConfirmation: boolean = true
) => {
  const uri = isEmailConfirmation ? "verify-email/" : "verify-2fa/";
  return await MakeRequest<LoginResponse>({
    method: "post",
    url: uri,
    data: {
      email,
      code,
    },
  });
};

export const accountVerification = async (token: string) => {
  return await MakeRequest<{ detail: string }>({
    url: `confirm-email/${token}`,
  });
};

// export  const resendCodehandler = await () => {
//   return await MakeRequest<>({url})
// };

export const requestPasswordRecovery = async (email: string) => {
  return await MakeRequest<{ detail: string }>({
    data: { email },
    url: "password-reset/request/",
    method: "post",
  });
};

export const resetPassword = async (
  newPassword: string,
  uid: string,
  token: string
) => {
  return await MakeRequest<{ detail: string }>({
    data: { password: newPassword, uid, token },
    url: "password-reset/confirm/",
    method: "post",
  });
};
