"use client"

import {Card, CardContent, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/login/login-form";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {getClient} from "@/lib/graph/client";
import {AskForNewPasswordDocument} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import ResetPasswordDialog from "@/app/login/reset-password-dialog";


export default function LoginPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleReset(mail: string) {
    const client = getClient();

    try {
      await client.request(AskForNewPasswordDocument, {mail: mail})
      toast.success("Die Admins wurden benachrichtigt")
    } catch (err) {
      if (String(err).includes("not found"))
        toast.success("Die Admins wurden benachrichtigt")
      else
        toast.error("Ein Fehler ist aufgetreten, versuche es später nochmal")
    }

    setDialogOpen(false);
  }

  return (
    <>
      <div className={'flex justify-center items-center grow'}>
        <Card>
          <CardContent>
            <CardTitle className={'w-full flex justify-center'}>
              Anmelden
            </CardTitle>
            <div className={'flex flex-col items-end'}>
              <LoginForm/>
              <Button
                variant={'link'}
                onClick={() => setDialogOpen(true)}
                className={'pr-0 text-muted-foreground'}
              >
                Passwort vergessen
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>

      <ResetPasswordDialog onConfirm={handleReset} open={dialogOpen} onOpenChange={setDialogOpen}/>
    </>
  )
}
