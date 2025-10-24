import axios from "axios";
import ApiRequest from "./config";
import Api from "./config";
export type RequestT = {
  method?: "get" | "post";
  data?: unknown;
  url: string;
  params?: Record<string, unknown>;
  FetchType?: keyof typeof Api;
};

export type SuccessResponse<T> = { success: true; data: T };
export type ErrorResponse = { success: false; error: string };

export async function MakeRequest<TSuccess>({
  method = "get",
  url,
  data,
  params,
  FetchType = "ApiRequest",
}: RequestT): Promise<SuccessResponse<TSuccess> | ErrorResponse> {
  try {
    const isFormData = data instanceof FormData;

    const contentType = isFormData ? "multipart/form-data" : "application/json";

    const response = await Api[FetchType].request({
      url,
      method,
      data,
      params,
      headers: {
        "Content-Type": contentType,
      },
    });

    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      let err: string = "";
      if (error.response?.data) {
        for (const [key, value] of Object.entries(error.response?.data)) {
          err += err + value + "\n";
        }

        return {
          success: false,
          error: err,
        };
      }
      return {
        success: false,
        error:
          error.response?.data.detail ??
          error.message ??
          "Houve um erro interno com servidor",
      };
    }
    return { success: false, error: "Erro desconhecido" };
  }
}
