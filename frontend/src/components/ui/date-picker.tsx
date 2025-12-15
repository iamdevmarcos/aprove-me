"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ptBR as ptBRDayPicker } from "react-day-picker/locale"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/helpers/utils"

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  className,
  id,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  // Parse date string as local date to avoid timezone issues
  const date = value ? (() => {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  })() : undefined

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Format as local date string (yyyy-MM-dd) without timezone conversion
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      onChange?.(formattedDate)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
          id={id}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          locale={ptBRDayPicker}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

