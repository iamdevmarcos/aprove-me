import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { cn } from "@/src/helpers/utils"
import type { ReactNode } from "react"

interface DashboardCardUIProps {
  title: string
  value?: string
  helper?: string
  href?: string
  buttonText?: string
  tone?: "default" | "primary" | "action" | "dark"
  asButton?: boolean
  icon?: ReactNode
}

export function DashboardCardUI({
  title,
  value,
  helper,
  href,
  buttonText,
  tone = "default",
  asButton = false,
  icon,
}: DashboardCardUIProps) {
  const cardClass = cn(
    "rounded-2xl border shadow-sm transition hover:shadow-md",
    tone === "primary" && "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none",
    tone === "action" && "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none",
    tone === "dark" && "bg-black text-white border-black"
  )

  const valueClass = cn(
    "text-2xl font-semibold tracking-tight",
    tone === "primary" || tone === "action" || tone === "dark"
      ? "text-white"
      : "text-foreground"
  )

  const helperClass = cn(
    "text-xs",
    tone === "primary" || tone === "action"
      ? "text-emerald-50/80"
      : tone === "dark"
      ? "text-zinc-300"
      : "text-muted-foreground"
  )

  const content = (
    <Card className={cardClass}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3 pt-4 px-5">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {helper && (
            <CardDescription className={helperClass}>{helper}</CardDescription>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "rounded-full p-2",
              tone === "primary" && "bg-emerald-600/40 text-white",
              tone === "action" && "bg-indigo-600/40 text-white",
              tone === "dark" && "bg-white/10 text-white",
              tone === "default" && "bg-muted text-foreground"
            )}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex items-end justify-between px-5 pb-4 pt-2">
        {value && <p className={valueClass}>{value}</p>}
        {href && buttonText && (
          <Link href={href}>
            <Button
              size="sm"
              variant={
                tone === "primary" || tone === "action"
                  ? "secondary"
                  : tone === "dark"
                  ? "secondary"
                  : "outline"
              }
              className={
                tone === "dark"
                  ? "mt-2 bg-white text-black hover:bg-zinc-100"
                  : "mt-2"
              }
            >
              {buttonText}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )

  if (asButton) {
    return (
      <button
        type="button"
        className="text-left"
      >
        {content}
      </button>
    )
  }

  return content
}

