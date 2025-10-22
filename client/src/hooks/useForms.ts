import React, { useState, type ChangeEvent } from "react";
import type { Credentials } from "../types/types";

function useForms() {
  const [open, setOpen] = useState(false);
  const [erroeMessage, setErrorMessage] = useState<string>("");
  const [credential, setCredential] = useState<Credentials>({
    email: "varelanhaterra@gmail.com",
    password: "senha1234",
  });

  const [openSnack, setOpenSnack] = useState<boolean>(false);

  const openSnackBarHandle = () => {
    setOpenSnack(true);
  };

  const closeSnackBarHandle = () => {
    setOpenSnack(false);
  };

  const handleCredentialChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCredential((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorMessageChange = (message: string) => {
    setErrorMessage(message);
  };

  const loginModalConfim = { open, handleClickOpen, handleClose };
  const snackBarControl = {
    openSnack,
    openSnackBarHandle,
    closeSnackBarHandle,
  };

  return {
    loginModalConfim,
    handleCredentialChange,
    credential,
    handleErrorMessageChange,
    erroeMessage,
    snackBarControl,
  };
}

export default useForms;
