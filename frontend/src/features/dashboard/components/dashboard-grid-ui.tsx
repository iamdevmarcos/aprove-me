"use client"

import { DashboardCardUI } from "./dashboard-card-ui"
import { useAssignors } from "@/src/features/assignors/hooks/use-assignors"
import { usePayables } from "@/src/features/payables/hooks/use-payables"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { formatDocument } from "@/src/helpers/utils"
import { LineChart, Receipt, Users, Zap } from "lucide-react"

export function DashboardGridUI() {
  const { data: assignors = [] } = useAssignors()
  const { data: payables = [] } = usePayables()

  const totalAssignors = assignors.length
  const totalPayables = payables.length
  const totalValue = payables.reduce((sum, p) => sum + p.value, 0)

  const formattedTotalValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalValue || 0)

  return (
    <div className="space-y-6 pb-0">
      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCardUI
          tone="primary"
          title="Total em recebíveis"
          value={formattedTotalValue}
          helper="Valor total previsto em recebíveis"
          icon={<LineChart className="h-4 w-4" />}
        />

        <DashboardCardUI
          title="Recebíveis"
          value={totalPayables.toString()}
          helper="Cadastros ativos"
          href="/dashboard/payables"
          buttonText="Ver recebíveis"
          icon={<Receipt className="h-4 w-4" />}
        />

        <DashboardCardUI
          title="Cedentes"
          value={totalAssignors.toString()}
          helper="Empresas cadastradas"
          href="/dashboard/assignors"
          buttonText="Ver cedentes"
          icon={<Users className="h-4 w-4" />}
        />

        <DashboardCardUI
          tone="dark"
          title="Processar em lote"
          helper="Processar recebíveis em lote"
          href="/dashboard/payables/batch"
          buttonText="Processar"
          icon={<Zap className="h-4 w-4" />}
        />
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Cedentes recentes
            </p>
            <p className="text-xs text-muted-foreground">
              Últimos cedentes cadastrados no sistema.
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignors.slice(0, 3).map((assignor) => (
              <TableRow key={assignor.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src="https://avatars.githubusercontent.com/u/92524722?v=4"
                        alt={assignor.name}
                      />
                      <AvatarFallback className="text-[10px] font-semibold">
                        {assignor.name?.[0] ?? "C"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{assignor.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {formatDocument(assignor.document)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs">
                  {assignor.email}
                </TableCell>
              </TableRow>
            ))}
            {assignors.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-4 text-center text-xs text-muted-foreground">
                  Nenhum cedente cadastrado ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

