"use client"

import { DashboardCardUI } from "./dashboard-card-ui"
import { useAssignors } from "@/src/features/assignors/hooks/use-assignors"
import { usePayables } from "@/src/features/payables/hooks/use-payables"
import { DataTable } from "@/src/components/ui/data-table"
import { assignorsColumns } from "@/src/features/assignors/components/assignors-columns"
import { LineChart, Receipt, Users, Zap } from "lucide-react"

export function DashboardGridUI() {
  const { data: assignors = [] } = useAssignors()
  const { data: payables = [] } = usePayables()

  const recentAssignorsColumns = assignorsColumns.filter((column) => column.id !== "actions")

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
            <p className="text-sm font-semibold text-foreground">
              Cedentes recentes
            </p>
          </div>
        </div>

        <DataTable
          columns={recentAssignorsColumns}
          data={assignors.slice(0, 3)}
          hideToolbar
          hideFooter
          pageSize={3}
        />
      </div>
    </div>
  )
}
