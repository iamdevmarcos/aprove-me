"use client"

import * as React from "react"
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion"
import { Check, Copy } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/src/helpers/utils"

const copyButtonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        muted: "bg-muted text-muted-foreground",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      size: {
        default: "h-8 w-8 rounded-lg [&_svg]:h-4 [&_svg]:w-4",
        sm: "h-6 w-6 [&_svg]:h-3 [&_svg]:w-3",
        md: "h-10 w-10 rounded-lg [&_svg]:h-5 [&_svg]:w-5",
        lg: "h-12 w-12 rounded-xl [&_svg]:h-6 [&_svg]:w-6",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
)

type CopyButtonBaseProps = Omit<HTMLMotionProps<"button">, "children" | "onCopy"> &
  VariantProps<typeof copyButtonVariants> & {
    content?: string
    delay?: number
    onCopy?: (content: string) => void | boolean
    isCopied?: boolean
    onCopyChange?: (isCopied: boolean) => void
  }

export function CopyButton({
  content,
  className,
  size,
  variant,
  delay = 2000,
  onClick,
  onCopy,
  isCopied,
  onCopyChange,
  ...props
}: CopyButtonBaseProps) {
  const [localIsCopied, setLocalIsCopied] = React.useState(isCopied ?? false)
  const Icon = localIsCopied ? Check : Copy

  React.useEffect(() => {
    setLocalIsCopied(isCopied ?? false)
  }, [isCopied])

  const handleIsCopied = React.useCallback(
    (value: boolean) => {
      setLocalIsCopied(value)
      onCopyChange?.(value)
    },
    [onCopyChange]
  )

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isCopied) return

      if (content) {
        const shouldCopy = onCopy?.(content)
        if (shouldCopy === false) {
          onClick?.(e)
          return
        }

        navigator.clipboard
          .writeText(content)
          .then(() => {
            handleIsCopied(true)
            setTimeout(() => handleIsCopied(false), delay)
          })
          .catch((error) => {
            console.error("Erro ao copiar para a área de transferência", error)
          })
      }

      onClick?.(e)
    },
    [isCopied, content, delay, onClick, onCopy, handleIsCopied]
  )

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(copyButtonVariants({ variant, size }), className)}
      onClick={handleCopy}
      aria-label="Copiar para área de transferência"
      {...(props as any)}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={localIsCopied ? "check" : "copy"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Icon className="h-3.5 w-3.5" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}


