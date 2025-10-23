import React, { useState, type ChangeEvent, type FormEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert, Box, CircularProgress, Slide } from "@mui/material";
import { codeConfirmation } from "../../services/auth/login";
import { useAuth } from "../../hooks/useAuth";
import useForms from "../../hooks/useForms";
import { useNavigate } from "react-router-dom";

export type CodeConfirmationProps = {
  open: boolean;
  email: string;
  handleClickOpen: () => void;
  handleClose: () => void;
  goTo: string;
  showAlertAfter?: string;
  isAccoutConfirmation?: boolean;
};

function CodeConfirmation({
  handleClickOpen,
  handleClose,
  open,
  email,
  isAccoutConfirmation = false,
}: CodeConfirmationProps) {
  const [isCheckingCode, setIsCheckingCode] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const label = isAccoutConfirmation
    ? "Para continuar, confirme o email com código enviado para seu email."
    : "insira código enviado para seu email";
  const { handleErrorMessageChange, erroeMessage } = useForms();
  const { loadLogedUser } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");

  const handleCloseClick = (
    _event: object,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    handleClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCheckingCode(true);
    const response = await codeConfirmation(email, code, isAccoutConfirmation);
    console.log("response ", response);

    if (response.success) {
      handleClickOpen();
      await loadLogedUser();
      setShowMessage(true);
    } else {
      handleErrorMessageChange(response.error);
    }
    setIsCheckingCode(false);
  };

  const setCodeHandle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCode(e.target.value);
    handleErrorMessageChange("");
  };
  return (
    <>
      <Dialog
        slots={{ transition: Slide }}
        open={open}
        onClose={handleCloseClick}
      >
        <DialogTitle>{label}</DialogTitle>
        <DialogContent>
          {isCheckingCode ? (
            <Box
              className=" w-[400px]"
              sx={{ display: "flex", justifyContent: "center", p: 2 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <form
                className="w-[400px]"
                onSubmit={handleSubmit}
                id="subscription-form"
              >
                <TextField
                  value={code}
                  onChange={setCodeHandle}
                  autoFocus
                  required
                  margin="dense"
                  error={!!erroeMessage}
                  id="name"
                  name="email"
                  label={erroeMessage ?? "Código de confirmação"}
                  type="number"
                  fullWidth
                  variant="standard"
                />
              </form>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseClick}
          >
            Cancelar
          </Button>
          <Button
            disabled={isCheckingCode}
            variant="contained"
            type="submit"
            form="subscription-form"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CodeConfirmation;
