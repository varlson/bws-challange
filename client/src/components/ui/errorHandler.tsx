import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Fade } from "@mui/material";

export type FeedBackSnackBarProps = {
  message: string;
  severity: "error" | "warning" | "info" | "success";
  open: boolean;
  handleClose: () => void;
};

export default function FeedBackSnackBar({
  message,
  severity,
  handleClose,
  open,
}: FeedBackSnackBarProps) {
  return (
    <div>
      <Snackbar
        slots={{ transition: Fade }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        autoHideDuration={10000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
