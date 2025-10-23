import React, {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import type { CompanyResponse } from "../services/company/company.model";
import { listCompanies } from "../services/company/company.services";
import type { CreateUserRequest } from "../services/users/users.models";

function useHooks() {
  //Error Message

  const emptyUser = {
    company_id: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    phone: "",
    profile_picture: "",
    username: "",
    password_confirmation: "",
  };

  const [error, setError] = useState<string | null>(null);

  const errorSetter = (currentError: string) => {
    setError(currentError);
  };
  const resetSetter = () => {
    setError(null);
  };

  // Controle de modal
  const [modalState, setModalState] = useState<boolean>(false);
  const modalControl = (state: "open" | "close") => {
    setModalState(state == "close" ? false : true);
  };

  // Loader
  const [isLoading, setIsLoading] = useState(false);
  const starLoadingHandle = () => {
    setIsLoading(true);
  };

  const stopLoadingHandle = () => {
    setIsLoading(false);
  };

  // Company loader
  const [companies, setCompanies] = useState<CompanyResponse[] | null>(null);

  const loadCompanies = useCallback(async () => {
    setIsLoading(true);

    const response = await listCompanies();
    if (response.success) {
      setCompanies(response.data);
    }

    setIsLoading(false);
    return response;
  }, []);

  const loadingController = {
    isLoading,
    starLoadingHandle,
    stopLoadingHandle,
  };

  const errorHandlerController = { errorSetter, resetSetter, error };

  // Create user

  const [user, setUser] = useState<CreateUserRequest>(emptyUser);

  const setUserHandle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetUser = () => {
    setUser(emptyUser);
  };

  return {
    modalControl,
    modalState,
    loadingController,
    companies,
    loadCompanies,
    errorHandlerController,
    user,
    setUserHandle,
    resetUser,
    setUser,
  };
}

export default useHooks;
