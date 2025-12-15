import { DashboardHeaderUI } from "@/src/features/dashboard/components/dashboard-header-ui"
import { DashboardGridUI } from "@/src/features/dashboard/components/dashboard-grid-ui"

export default function DashboardPage() {
  return (
    <div className="bg-[#FAFAFA]">
      <div className="container mx-auto px-4 pt-8 pb-4 md:px-6 lg:px-8">
        <DashboardHeaderUI />
        <DashboardGridUI />
      </div>
    </div>
  )
}
