import axios from "axios";
import ApiRequest from "./config";

export type RequestT = {
  method?: "get" | "post";
  data?: unknown;
  url: string;
  params?: Record<string, unknown>;
};

export type SuccessResponse<T> = { success: true; data: T };
export type ErrorResponse = { success: false; error: string };

export async function MakeRequest<TSuccess>({
  method = "get",
  url,
  data,
  params,
}: RequestT): Promise<SuccessResponse<TSuccess> | ErrorResponse> {
  try {
    const isFormData = data instanceof FormData;

    const contentType = isFormData ? "multipart/form-data" : "application/json";

    console.log("content ", isFormData);

    const response = await ApiRequest.request({
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
    console.log("Error in MakeRequest:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data.detail ?? error.message,
      };
    }
    return { success: false, error: "Erro desconhecido" };
  }
}
