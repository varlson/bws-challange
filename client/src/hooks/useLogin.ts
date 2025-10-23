import { useState, useCallback } from "react";
import { authenticate } from "../services/auth/login";
import type { Credentials } from "../types/types";
// import type { LoginResponse } from "../services/auth/login";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials: Credentials) => {
    setIsLoading(true);

    const response = await authenticate(credentials);

    setIsLoading(false);
    return response;
  }, []);

  return { login, isLoading };
}
