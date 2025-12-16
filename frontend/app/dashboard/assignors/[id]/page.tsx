"use client"

import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { useParams } from "next/navigation"
import { Loading } from "@/src/components/ui/loading"
import { useAssignor } from "@/src/features/assignors/hooks/use-assignors"
import { ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { formatDocument } from "@/src/helpers/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion"
import { CopyButton } from "@/src/components/ui/copy-button"

export default function AssignorDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const { data: assignor, isLoading } = useAssignor(id)

  if (isLoading) return <Loading />

  if (!assignor) {
    return (
      <div className="container mx-auto flex flex-col gap-6 px-4 py-10 md:px-6 lg:px-8 tracking-[-0.8px]">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Cedente não encontrado.
        </div>
      </div>
    )
  }

  const payables = (assignor as any).payables as Array<{
    id: string
    value: number
    emissionDate: string
  }> | undefined

  const hasPayables = Array.isArray(payables) && payables.length > 0

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-10 md:px-6 lg:px-8 tracking-[-0.8px]">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/92524722?v=4"
              alt={assignor.name}
            />
            <AvatarFallback className="text-sm font-semibold">
              {assignor.name}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1
              className="text-3xl font-semibold -tracking-tighter"
              style={{ letterSpacing: "-2px" }}
            >
              {assignor.name}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {formatDocument(assignor.document)}
            </p>
          </div>
        </div>

        <Link href="/dashboard/assignors">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </header>

      <hr className="w-full border-t border-gray-200" />

      <section className="grid gap-8 md:grid-cols-2 w-full">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-black">ID completo</p>
            <div className="flex items-center gap-2">
              <div className="inline-block rounded-md bg-neutral-900 px-4 py-2 font-mono text-xs text-white dark:bg-neutral-100 dark:text-neutral-900 break-all">
                {assignor.id}
              </div>
              <CopyButton
                content={assignor.id}
                size="sm"
                aria-label="Copiar ID do cedente"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-black">Email</p>
            <p className="text-base text-foreground break-all">{assignor.email}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-black">Telefone</p>
            <p className="text-base text-foreground">{assignor.phone}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-black">Recebíveis do cedente</p>
          {hasPayables ? (
            <Accordion type="single" collapsible className="w-full rounded-lg border bg-card">
              {payables!.map((payable) => {
                const formattedValue = new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(payable.value)

                const emissionDate = new Date(payable.emissionDate).toLocaleDateString(
                  "pt-BR"
                )

                return (
                  <AccordionItem key={payable.id} value={payable.id} className="border-b last:border-b-0">
                    <AccordionTrigger className="px-4 py-3 text-left">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{payable.id}
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          {formattedValue}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Emissão: {emissionDate}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-0">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Valor</span>
                          <span className="font-semibold text-green-600">
                            {formattedValue}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Data de emissão</span>
                          <span>{emissionDate}</span>
                        </div>
                        <Link href={`/dashboard/payables/${payable.id}`}>
                          <Button variant="outline" size="sm" className="mt-2 w-full">
                            Ver detalhes do recebível
                          </Button>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
              Nenhum recebível vinculado a este cedente ainda.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

