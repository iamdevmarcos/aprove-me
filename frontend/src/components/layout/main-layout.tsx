import { Header } from "./header"
import { Footer } from "./footer"
import { Noise } from "@/src/components/ui/noise"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />
      <main className="relative flex-1 pb-6">{children}</main>
      <Footer />
      <Noise patternAlpha={4} />
    </div>
  )
}

