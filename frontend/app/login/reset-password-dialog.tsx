"use client"

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {DialogProps} from "@radix-ui/react-dialog";

interface ResetPasswordDialogProps extends DialogProps {
  onConfirm: (mail: string) => void
}

export default function ResetPasswordDialog(props: ResetPasswordDialogProps) {
  const [mail, setMail] = useState("");

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent data-cy={'reset-password-dialog'}>
        <DialogHeader>
          <DialogTitle>Password zurücksetzen</DialogTitle>
          <DialogDescription>
            Solltest du das Passwort zu deinem Account verloren haben,
            kannst du hiermit die Admins darauf aufmerksam machen. Sie bekommen dann eine Benachrichtigung,
            dass der Account mit dieser Mail einen Reset benötigt.
          </DialogDescription>
        </DialogHeader>
        <div className={'w-full flex flex-wrap gap-4'}>
          <Input
            data-cy={'mail-input'}
            className={'w-full'}
            value={mail}
            onChange={(e) => setMail(e.target.value.trim())}
            type={'text'}
            placeholder={'max.musterperson@kummer.kasten'}
          />
          <Button
            data-cy={'submit-button'}
            onClick={() => {
              setMail("")
              props.onConfirm(mail)
            }}
          >
            Absenden
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}