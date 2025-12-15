"use client"

import { useEffect, useState } from "react"
import { payableBatchApi } from "../services/payable-batch-api"
import type { BatchJobStatus } from "@/src/features/batch/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"

interface BatchStatusPanelProps {
  batchJobId: string
  onTerminalStatus?: (status: BatchJobStatus) => void
}

const TERMINAL_STATUSES: BatchJobStatus["status"][] = [
  "COMPLETED",
  "FAILED",
  "PARTIALLY_FAILED",
]

export function BatchStatusPanel({
  batchJobId,
  onTerminalStatus,
}: BatchStatusPanelProps) {
  const [status, setStatus] = useState<BatchJobStatus | null>(null)
  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const fetchStatus = async () => {
      const data = await payableBatchApi.getStatus(batchJobId)
      setStatus(data)

      if (TERMINAL_STATUSES.includes(data.status)) {
        setIsPolling(false)
        onTerminalStatus?.(data)
      }
    }

    fetchStatus()

    if (isPolling) {
      intervalId = setInterval(fetchStatus, 1500)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [batchJobId, isPolling, onTerminalStatus])

  if (!status) return null

  const progressValue = Math.min(Math.max(status.progress, 0), 100)

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-black">
              Lote #{status.id}
            </p>
            <p className="text-xs text-muted-foreground">
              Status:{" "}
              <span className="font-semibold">
                {status.status}
              </span>
            </p>
          </div>
          <div className="space-y-1 text-right text-xs">
            <p>
              Total:{" "}
              <span className="font-semibold">
                {status.totalItems}
              </span>
            </p>
            <p>
              Processados:{" "}
              <span className="font-semibold">
                {status.processedItems}
              </span>
            </p>
            <p>
              Sucesso:{" "}
              <span className="font-semibold text-emerald-600">
                {status.successCount}
              </span>{" "}
              • Falha:{" "}
              <span className="font-semibold text-red-600">
                {status.failureCount}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[11px] text-muted-foreground">
            {progressValue.toFixed(2)}%
          </p>
        </div>
      </div>

      {status.deadLetters.length > 0 && (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">
                Itens com erro
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead className="w-[120px] text-right">
                  Tentativas
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {status.deadLetters.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-xs font-mono">
                    #{index + 1}
                  </TableCell>
                  <TableCell className="text-xs">
                    {item.errorMessage || "Erro não informado"}
                  </TableCell>
                  <TableCell className="text-xs text-right">
                    {item.retryCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}


