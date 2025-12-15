"use client"

import { useState } from "react"
import { BatchUploadPanel } from "@/src/features/payables/components/batch-upload-panel"
import { BatchStatusPanel } from "@/src/features/payables/components/batch-status-panel"

export default function PayablesBatchPage() {
  const [batchJobId, setBatchJobId] = useState<string | null>(null)
  const [isBatchTerminal, setIsBatchTerminal] = useState(false)

  const handleBatchCreated = (id: string) => {
    setBatchJobId(id)
    setIsBatchTerminal(false)
  }

  const handleBatchTerminal = () => {
    setIsBatchTerminal(true)
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-4 md:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <h1
          className="text-3xl font-bold -tracking-tighter"
          style={{ letterSpacing: "-2px" }}
        >
          Processar recebíveis em lote
        </h1>
        <p className="text-muted-foreground">
          Envie um arquivo CSV e acompanhe o processamento em tempo real.
        </p>
      </div>

      {(!batchJobId || isBatchTerminal) && (
        <BatchUploadPanel onBatchCreated={handleBatchCreated} />
      )}

      {batchJobId && (
        <BatchStatusPanel
          batchJobId={batchJobId}
          onTerminalStatus={handleBatchTerminal}
        />
      )}
    </div>
  )
}


