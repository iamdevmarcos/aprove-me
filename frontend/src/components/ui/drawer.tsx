import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/src/helpers/utils"

interface DrawerProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Drawer({ children, open, onOpenChange }: DrawerProps) {
  return (
    <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DrawerPrimitive.Root>
  )
}

interface DrawerTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function DrawerTrigger({ children, ...props }: DrawerTriggerProps) {
  return <DrawerPrimitive.Trigger {...props}>{children}</DrawerPrimitive.Trigger>
}

interface DrawerContentProps {
  children: React.ReactNode
  className?: string
}

export function DrawerContent({ children, className }: DrawerContentProps) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-100 bg-black/40 pointer-events-auto" />
      <DrawerPrimitive.Content
        className={cn(
          "fixed bottom-0 left-1/2 z-100 mt-24 flex h-[calc(90%)] w-full max-w-[1000px] -translate-x-1/2 flex-col rounded-t-[10px] bg-background overflow-visible",
          className
        )}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  )
}

interface DrawerHeaderProps {
  children: React.ReactNode
  className?: string
}

export function DrawerHeader({ children, className }: DrawerHeaderProps) {
  return (
    <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}>
      {children}
    </div>
  )
}

interface DrawerTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerTitle({ children, className, ...props }: DrawerTitleProps) {
  return (
    <DrawerPrimitive.Title
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </DrawerPrimitive.Title>
  )
}

interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerDescription({
  children,
  className,
  ...props
}: DrawerDescriptionProps) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </DrawerPrimitive.Description>
  )
}

interface DrawerBodyProps {
  children: React.ReactNode
  className?: string
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
  return (
    <div className={cn("overflow-y-auto overflow-x-visible p-4", className)}>{children}</div>
  )
}

interface DrawerFooterProps {
  children: React.ReactNode
  className?: string
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return (
    <div className={cn("mt-auto flex gap-2 p-4", className)}>{children}</div>
  )
}

