"use client"

import { ChangeEvent, DragEvent, useRef, useState } from "react"
import { toast } from "sonner"
import { File, FileSpreadsheet, X } from "lucide-react"
import { payableBatchApi } from "../services/payable-batch-api"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"

interface BatchUploadPanelProps {
  onBatchCreated: (batchJobId: string) => void
}

interface UploadState {
  file: File | null
  progress: number
  uploading: boolean
}

export function BatchUploadPanel({ onBatchCreated }: BatchUploadPanelProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    progress: 0,
    uploading: false,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validFileTypes = ["text/csv"]

  const handleFile = (file: File | undefined) => {
    if (!file) return

    if (!validFileTypes.includes(file.type) && !file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Envie um arquivo CSV válido.", {
        position: "bottom-right",
        duration: 3000,
      })
      return
    }

    setUploadState({
      file,
      progress: 0,
      uploading: false,
    })
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0])
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    handleFile(event.dataTransfer.files?.[0])
  }

  const resetFile = () => {
    setUploadState({ file: null, progress: 0, uploading: false })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = () => {
    if (!uploadState.file) return <File />

    const fileExt = uploadState.file.name.split(".").pop()?.toLowerCase() || ""
    return ["csv"].includes(fileExt) ? (
      <FileSpreadsheet className="h-5 w-5 text-foreground" />
    ) : (
      <File className="h-5 w-5 text-foreground" />
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const { file, progress, uploading } = uploadState

  const startUpload = async () => {
    if (!file || uploading) return

    try {
      setUploadState((prev) => ({ ...prev, uploading: true, progress: 5 }))

      const response = await payableBatchApi.upload(file)
      onBatchCreated(response.batchJobId)

      setUploadState((prev) => ({ ...prev, progress: 100, uploading: false }))
      toast.success("Arquivo enviado com sucesso. Processamento iniciado.", {
        position: "bottom-right",
        duration: 3000,
      })
    } catch (error: any) {
      setUploadState((prev) => ({ ...prev, uploading: false }))
      
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout')
      const isServiceUnavailable = error.response?.status === 503
      
      if (isTimeout || isServiceUnavailable) {
        toast.warning(
          "O processamento pode estar em andamento. Verifique o status do lote.",
          {
            position: "bottom-right",
            duration: 5000,
          }
        )
      } else {
        toast.error(
          error.response?.data?.message || "Não foi possível enviar o arquivo. Tente novamente.",
          {
            position: "bottom-right",
            duration: 3000,
          }
        )
      }
    }
  }

  return (
    <div className="mb-4 rounded-2xl border bg-white p-4 shadow-sm max-w-3xl mx-auto">
      <form
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault()
          startUpload()
        }}
      >
        <p className="text-sm font-medium text-black">
          Processar recebíveis em lote
        </p>
        <p className="text-xs text-muted-foreground">
          Envie um arquivo CSV no formato esperado para criar vários recebíveis de uma vez.
        </p>

        <div
          className="mt-4 flex justify-center rounded-md border border-dashed border-input px-6 py-10"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <File className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
            <div className="mt-2 flex flex-wrap items-center justify-center text-xs leading-6 text-muted-foreground">
              <p>Arraste e solte o arquivo ou</p>
              <label
                htmlFor="batch-file-upload"
                className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:underline hover:underline-offset-4"
              >
                <span>escolha um arquivo</span>
                <input
                  id="batch-file-upload"
                  name="batch-file-upload"
                  type="file"
                  className="sr-only"
                  accept=".csv"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1">para enviar</p>
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
          <span>Tipo aceito: arquivo CSV.</span>
          <span className="pl-1 sm:pl-0">Tamanho máximo: 10MB</span>
        </p>

        {file && (
          <Card className="relative mt-6 bg-muted p-4 gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Remover"
              onClick={resetFile}
            >
              <X className="h-5 w-5 shrink-0" aria-hidden />
            </Button>
            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border">
                {getFileIcon()}
              </span>
              <div>
                <p className="text-xs font-medium text-foreground">
                  {file.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Progress value={progress} className="h-1.5" />
              <span className="text-xs text-muted-foreground">
                {progress}%
              </span>
            </div>
          </Card>
        )}

        <div className="mt-6 flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap"
            onClick={resetFile}
            disabled={!file || uploading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="whitespace-nowrap"
            disabled={!file || uploading}
          >
            {uploading ? "Enviando..." : "Enviar e processar"}
          </Button>
        </div>
      </form>
    </div>
  )
}


