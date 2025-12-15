"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { DataTable } from "@/src/components/ui/data-table"
import { useAssignors, useDeleteAssignor } from "@/src/features/assignors/hooks/use-assignors"
import { CreateAssignorDrawer } from "@/src/features/assignors/components/create-assignor-drawer"
import { EditAssignorDrawer } from "@/src/features/assignors/components/edit-assignor-drawer"
import { assignorsColumns } from "@/src/features/assignors/components/assignors-columns"
import { useDrawer } from "@/src/hooks/use-drawer"
import { Loading } from "@/src/components/ui/loading"
import { EmptyState } from "@/src/components/ui/empty-state"
import type { Assignor } from "@/src/features/assignors/types"
import type { ApiError } from "@/src/services/api/types"
import { AxiosError } from "axios"
import { toast } from "sonner"

export default function AssignorsPage() {
  const { data: assignors = [], isLoading } = useAssignors()
  const createDrawer = useDrawer()
  const editDrawer = useDrawer()
  const deleteAssignor = useDeleteAssignor()
  const [selectedAssignor, setSelectedAssignor] = useState<Assignor | null>(null)

  const handleEdit = (assignor: Assignor) => {
    setSelectedAssignor(assignor)
    editDrawer.open()
  }

  const handleDelete = async (assignor: Assignor) => {
    if (
      confirm(
        `Tem certeza que deseja excluir o cedente "${assignor.name}"?\n\nEsta ação não pode ser desfeita.`
      )
    ) {
      try {
        await deleteAssignor.mutateAsync(assignor.id)
      } catch (error) {
        console.error("Erro ao excluir cedente:", error)
        
        // Extract error message from API response
        let errorMessage = "Não foi possível excluir o cedente. Tente novamente."
        
        if (error instanceof AxiosError) {
          const apiError = error.response?.data as ApiError | undefined
          if (apiError?.error) {
            errorMessage = apiError.error
          } else if (apiError?.message) {
            errorMessage = apiError.message
          }
        } else if (error && typeof error === 'object' && 'error' in error) {
          errorMessage = (error as { error: string }).error
        } else if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = (error as { message: string }).message
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
          <h1 className="text-4xl font-bold tracking-tight" style={{ letterSpacing: '-2px' }}>Cedentes</h1>
          <p className="text-muted-foreground">
            Gerencie os cedentes cadastrados
          </p>
        </div>
        <Button onClick={createDrawer.open}>Novo Cedente</Button>
      </div>

      {assignors.length === 0 ? (
        <EmptyState message="Nenhum cedente cadastrado ainda." />
      ) : (
        <DataTable
          columns={assignorsColumns}
          data={assignors}
          searchKey="email"
          searchPlaceholder="Filtrar por email..."
          meta={{
            onEdit: handleEdit,
            onDelete: handleDelete,
          }}
        />
      )}

      <CreateAssignorDrawer
        open={createDrawer.isOpen}
        onOpenChange={createDrawer.setIsOpen}
      />
      <EditAssignorDrawer
        open={editDrawer.isOpen}
        onOpenChange={editDrawer.setIsOpen}
        assignor={selectedAssignor}
      />
    </div>
  )
}
