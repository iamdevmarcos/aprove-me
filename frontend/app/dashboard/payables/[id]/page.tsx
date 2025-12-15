'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { useParams } from 'next/navigation'
import { Loading } from '@/src/components/ui/loading'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { formatDocument } from '@/src/helpers/utils'
import {
  usePayable,
  useDeletePayable,
} from '@/src/features/payables/hooks/use-payables'
import { EditPayableDrawer } from '@/src/features/payables/components/edit-payable-drawer'
import { useDrawer } from '@/src/hooks/use-drawer'
import type { ApiError } from '@/src/services/api/types'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function PayableDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const { data: payable, isLoading } = usePayable(id)
  const router = useRouter()
  const deletePayable = useDeletePayable()
  const editDrawer = useDrawer()

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
    'pt-BR'
  )

  const handleDelete = async () => {
    if (
      !confirm(
        `Tem certeza que deseja excluir este recebível no valor de ${formattedValue}?\n\nEsta ação não pode ser desfeita.`
      )
    ) {
      return
    }

    try {
      await deletePayable.mutateAsync(payable.id)
      toast.success("Recebível excluído com sucesso.")
      router.push("/dashboard/payables")
    } catch (error: unknown) {
      let errorMessage =
        "Não foi possível excluir o recebível. Tente novamente."

      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError | undefined
        if (apiError?.error) {
          errorMessage = apiError.error
        } else if (apiError?.message) {
          errorMessage = apiError.message
        }
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message?: string }).message || errorMessage
      }

      toast.error(errorMessage)
    }
  }

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

          <div className="flex items-center gap-2">
            <Link href="/dashboard/payables">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={editDrawer.open}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <hr className="w-full border-t border-gray-200" />

        <section className="flex flex-col gap-4 w-full">
          <div className="space-y-2">
            <p className="text-sm font-medium text-black">
              ID completo
            </p>
            <div className="inline-block rounded-md bg-neutral-900 px-4 py-2 font-mono text-base text-white dark:bg-neutral-100 dark:text-neutral-900 break-all">
              {payable.id}
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

      <EditPayableDrawer
        open={editDrawer.isOpen}
        onOpenChange={editDrawer.setIsOpen}
        payable={payable}
      />
    </>
  )
}

 