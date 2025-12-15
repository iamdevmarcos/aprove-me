"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { DataTable } from "@/src/components/ui/data-table"
import { useDeletePayable, usePayables } from "@/src/features/payables/hooks/use-payables"
import { CreatePayableDrawer } from "@/src/features/payables/components/create-payable-drawer"
import { EditPayableDrawer } from "@/src/features/payables/components/edit-payable-drawer"
import { payablesColumns } from "@/src/features/payables/components/payables-columns"
import { useDrawer } from "@/src/hooks/use-drawer"
import { Loading } from "@/src/components/ui/loading"
import { EmptyState } from "@/src/components/ui/empty-state"
import type { Payable } from "@/src/features/payables/types"
import type { ApiError } from "@/src/services/api/types"
import { AxiosError } from "axios"
import { toast } from "sonner"

export default function PayablesPage() {
  const { data: payables = [], isLoading } = usePayables()
  const createDrawer = useDrawer()
  const editDrawer = useDrawer()
  const deletePayable = useDeletePayable()
  const [selectedPayable, setSelectedPayable] = useState<Payable | null>(null)

  const handleEdit = (payable: Payable) => {
    setSelectedPayable(payable)
    editDrawer.open()
  }

  const handleDelete = async (payable: Payable) => {
    if (
      confirm(
        `Tem certeza que deseja excluir o recebível de valor ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(payable.value)}?\n\nEsta ação não pode ser desfeita.`
      )
    ) {
      try {
        await deletePayable.mutateAsync(payable.id)
        toast.success("Recebível excluído com sucesso.")
      } catch (error) {
        let errorMessage = "Não foi possível excluir o recebível. Tente novamente."

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
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-10 md:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight" style={{ letterSpacing: '-2px' }}>Recebíveis</h1>
            <p className="text-muted-foreground">
              Gerencie todos os seus recebíveis
            </p>
          </div>
          <Button onClick={createDrawer.open}>Novo Recebível</Button>
        </div>

        {payables.length === 0 ? (
          <EmptyState message="Nenhum recebível cadastrado ainda." />
        ) : (
          <DataTable
            columns={payablesColumns}
            data={payables}
            meta={{
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        )}

        <CreatePayableDrawer open={createDrawer.isOpen} onOpenChange={createDrawer.setIsOpen} />
        <EditPayableDrawer
          open={editDrawer.isOpen}
          onOpenChange={editDrawer.setIsOpen}
          payable={selectedPayable}
        />
    </div>
  )
}
