import Link from "next/link"
import { AccountAccessForm } from "@/components/auth/account-access-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function ConfigureAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; mode?: string }>
}) {
  const params = await searchParams
  const token = params.token?.trim()
  const mode = params.mode === "reset" ? "reset" : "invite"

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Lien invalide</CardTitle>
          <CardDescription>
            Ce lien de configuration est incomplet ou manquant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/recuperer-acces">
            <Button className="w-full">Demander un nouveau lien</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return <AccountAccessForm token={token} mode={mode} />
}
