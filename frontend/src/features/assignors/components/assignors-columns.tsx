"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { Assignor } from "../types"
import { formatDocument } from "@/src/helpers/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

export const assignorsColumns: ColumnDef<Assignor>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue<string>("name")

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/92524722?v=4"
              alt={name}
            />
            <AvatarFallback className="text-xs font-semibold">
              {name}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{name}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "document",
    header: "Documento",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{formatDocument(row.getValue("document"))}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row, table }) => {
      const assignor = row.original
      const meta = table.options.meta as {
        onEdit?: (assignor: Assignor) => void
        onDelete?: (assignor: Assignor) => void
      }

      return (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/dashboard/assignors/${assignor.id}`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          {meta?.onEdit && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => meta.onEdit?.(assignor)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {meta?.onDelete && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => meta.onDelete?.(assignor)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    },
  },
]
