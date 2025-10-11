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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Password zurücksetzen</DialogTitle>
          <DialogDescription>Solltest du das Passwort zu deinem Account verloren hast, kannst du hier die Admins nach
            einem neuen Fragen</DialogDescription>
        </DialogHeader>
        <div className={'w-full flex flex-wrap gap-4'}>
          <Input
            className={'w-full'}
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            type={'text'}
            placeholder={'max.musterperson@kummer.kasten'}
          />
          <Button
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