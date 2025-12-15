import { MainLayout } from "@/src/components/layout/main-layout"
import { ProtectedRoute } from "@/src/features/auth/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  )
}

