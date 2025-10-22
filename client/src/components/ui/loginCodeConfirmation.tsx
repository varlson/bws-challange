import React, { useState, type FormEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, CircularProgress } from "@mui/material";
import { twoFactprAuthenticate } from "../../services/auth/login";

export type LoginCodeConfirmationProps = {
  open: boolean;
  email: string;
  handleClickOpen: () => void;
  handleClose: () => void;
};

function LoginCodeConfirmation({
  handleClickOpen,
  handleClose,
  open,
  email,
}: LoginCodeConfirmationProps) {
  const [isCheckingCode, setIsCheckingCode] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCheckingCode(true);
    // handleClose();
    const response = await twoFactprAuthenticate(email, code);
    console.log("response ", response);
    setIsCheckingCode(false);

    if (response.success) {
      handleClickOpen();
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isCheckingCode
            ? "Aguarde um pouco"
            : "Insira o código enviado para seu email"}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}

          {isCheckingCode ? (
            <Box
              className=" w-[400px]"
              sx={{ display: "flex", justifyContent: "center", p: 2 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <form
              className="w-[400px]"
              onSubmit={handleSubmit}
              id="subscription-form"
            >
              <TextField
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoFocus
                required
                margin="dense"
                id="name"
                name="email"
                label="Código de confirmação"
                type="number"
                fullWidth
                variant="standard"
              />
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
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

export default LoginCodeConfirmation;
