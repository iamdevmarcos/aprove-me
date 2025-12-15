import Image from "next/image"
import { Card, CardContent } from "@/src/components/ui/card"

interface EmptyStateProps {
  message: string
  imageSrc?: string
  imageAlt?: string
}

export function EmptyState({
  message,
  imageSrc = "/assets/empty_table.png",
  imageAlt = "Vazio",
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center justify-center gap-6">
          <Image
            width={400}
            height={300}
            src={imageSrc}
            alt={imageAlt}
            className="w-auto h-auto max-w-[400px] max-h-[300px] object-contain"
            loading="eager"
          />
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

