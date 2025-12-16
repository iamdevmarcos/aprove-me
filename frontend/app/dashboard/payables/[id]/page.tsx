'use client'

import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { useParams } from "next/navigation"
import { Loading } from "@/src/components/ui/loading"
import { ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { formatDocument } from "@/src/helpers/utils"
import { CopyButton } from "@/src/components/ui/copy-button"
import { usePayable } from "@/src/features/payables/hooks/use-payables"

export default function PayableDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const { data: payable, isLoading } = usePayable(id)

  if (isLoading) {
    return <Loading />
  }

  if (!payable) {
    return (
      <div className="container mx-auto flex flex-col gap-6 px-4 py-10 md:px-6 lg:px-8 tracking-[-0.8px]">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Recebível não encontrado.
        </div>
      </div>
    )
  }

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(payable.value)

  const emissionDate = new Date(payable.emissionDate).toLocaleDateString(
    "pt-BR",
  )

  return (
    <>
      <div className="container mx-auto flex flex-col gap-8 px-4 py-10 md:px-6 lg:px-8 tracking-[-0.8px]">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1
                className="text-3xl font-semibold -tracking-tighter"
                style={{ letterSpacing: '-2px' }}
              >
                Recebível #{payable.id}
              </h1>
            </div>
          </div>

          <Link href="/dashboard/payables">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </header>

        <hr className="w-full border-t border-gray-200" />

        <section className="flex flex-col gap-4 w-full">
          <div className="space-y-2">
            <p className="text-sm font-medium text-black">
              ID completo
            </p>
            <div className="flex items-center gap-2">
              <div className="inline-block rounded-md bg-neutral-900 px-4 py-2 font-mono text-xs text-white dark:bg-neutral-100 dark:text-neutral-900 break-all">
                {payable.id}
              </div>
              <CopyButton
                content={payable.id}
                size="sm"
                aria-label="Copiar ID do recebível"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-black">
              Valor
            </p>
            <p className="text-lg font-semibold text-green-600">
              {formattedValue}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-black">
              Data de emissão
            </p>
            <p className="text-base text-foreground">{emissionDate}</p>
          </div>

          {payable.assignor && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-black">Cedente</p>
              <Link
                href={`/dashboard/assignors/${payable.assignor.id}`}
                className="inline-flex"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://avatars.githubusercontent.com/u/92524722?v=4"
                      alt={payable.assignor.name}
                    />
                    <AvatarFallback className="text-xs font-semibold">
                      {payable.assignor.name}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{payable.assignor.name}</span>
                    <span className="text-sm text-muted-foreground font-mono">
                      {formatDocument(payable.assignor.document)}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </section>
      </div>

    </>
  )
}

 