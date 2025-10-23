import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown, string>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type ModalProps = {
  children: React.ReactNode;
  state: boolean;
  title: string;
  confirmLabel?: string;
  oncloseAction?: () => void;
  stateControl: (state: "open" | "close") => void;
};
export default function Modal({
  title,
  children,
  state,
  confirmLabel,
  stateControl,
  oncloseAction,
}: ModalProps) {
  const closeHandle = () => {
    stateControl("close");
    if (oncloseAction) {
      oncloseAction();
    }
  };
  return (
    <React.Fragment>
      <Dialog
        open={state}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={stateControl}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle color="textPrimary">{title}</DialogTitle>
        <DialogContent sx={{ width: "100%", margin: "auto" }}>
          {children}
        </DialogContent>
        {confirmLabel && (
          <DialogActions>
            <Button variant="contained" onClick={closeHandle}>
              {confirmLabel}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
