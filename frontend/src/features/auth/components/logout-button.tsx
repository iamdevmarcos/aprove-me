"use client"

import { useAuth } from "../context/auth-context"
import { Button } from "@/src/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const { logout } = useAuth()

  return (
    <Button variant="ghost" size="sm" onClick={logout}>
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  )
}

