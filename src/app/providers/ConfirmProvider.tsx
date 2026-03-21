import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { ConfirmContext, type ConfirmOptions } from "@/shared/contexts/ConfirmContext";
import { useState } from "react";

interface State {
  open: boolean;
  resolve?: (value: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

const defaultState: State = {
  open: false,
  title: "Xác nhận",
  description: "Bạn có chắc chắn với hành động này?",
  confirmText: "Tôi chắc chắn",
  cancelText: "Huỷ",
};

export default function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ ...defaultState });

  const confirm = (options?: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        open: true,
        resolve,
        title: options?.title ?? defaultState.title,
        description: options?.description ?? defaultState.description,
        confirmText: options?.confirmText ?? defaultState.confirmText,
        cancelText: options?.cancelText ?? defaultState.cancelText,
      });
    });
  };

  const handleClose = (result: boolean) => {
    state.resolve?.(result);
    setState({ ...defaultState, open: false });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <AlertDialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open) handleClose(false);
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.description}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleClose(false)}>{state.cancelText}</AlertDialogCancel>

            <AlertDialogAction onClick={() => handleClose(true)}>{state.confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}
