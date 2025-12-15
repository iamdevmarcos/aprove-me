'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Payable } from '../types'

export const payablesColumns: ColumnDef<Payable>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const id = row.getValue<string>("id")

      return (
        <div className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-mono text-sm px-3 py-1.5 rounded-md inline-block">
          {id}
        </div>
      )
    },
    meta: {
      className: "!px-2",
    },
    size: 120,
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"))
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value)

      return <div className="font-medium">{formatted}</div>
    },
    meta: {
      className: "!px-2",
    },
    size: 120,
  },
  {
    accessorKey: "emissionDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Emissão
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("emissionDate"))
      return date.toLocaleDateString("pt-BR")
    },
    meta: {
      className: "!px-2",
    },
    size: 140,
  },
  {
    accessorKey: "assignor.name",
    header: "Cedente",
    cell: ({ row }) => {
      const assignor = row.original.assignor

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://avatars.githubusercontent.com/u/92524722?v=4" alt={assignor?.name} />
            <AvatarFallback className="text-xs font-semibold">
              {assignor?.name}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{assignor?.name}</span>
        </div>
      )
    },
    meta: {
      className: "!px-2",
    },
    size: 260,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row, table }) => {
      const payable = row.original
      const meta = table.options.meta as {
        onEdit?: (payable: Payable) => void
        onDelete?: (payable: Payable) => void
      }

      return (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/dashboard/payables/${payable.id}`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          {meta?.onEdit && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => meta.onEdit?.(payable)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {meta?.onDelete && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => meta.onDelete?.(payable)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    },
  },
]


