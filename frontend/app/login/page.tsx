"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/src/features/auth/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { useAuth } from "@/src/features/auth/context/auth-context"
import { Loading } from "@/src/components/ui/loading"

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) {
    return <Loading />
  }

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <Link
        href="/"
        className="absolute left-8 top-8 z-10 flex items-center gap-2"
      >
        <Image
          src="/assets/logo-bankme.png"
          alt="Bankme"
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <span className="text-2xl font-semibold">Aprove-me</span>
      </Link>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Bem-vindo de volta!</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <div className="mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative hidden lg:flex items-center justify-center p-4 pr-4">
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
          <Image
            src="/assets/login_bg.jpg"
            alt="Background"
            fill
            className="object-cover"
            quality={100}
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  )
}
