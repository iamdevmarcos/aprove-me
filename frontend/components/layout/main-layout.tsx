import { Header } from "./header"
import { Noise } from "@/src/components/ui/noise"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-1">{children}</main>
      <Noise patternAlpha={4} />
    </div>
  )
}

