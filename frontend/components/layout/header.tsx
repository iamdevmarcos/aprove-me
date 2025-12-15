import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/assets/logo-bankme.png"
            alt="Bankme"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-semibold">Aprove-me</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard/payables">
            <Button variant="ghost">Recebíveis</Button>
          </Link>
          <Link href="/dashboard/assignors">
            <Button variant="ghost">Cedentes</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

