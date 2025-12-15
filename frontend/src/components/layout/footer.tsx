export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full flex items-center justify-center bg-[#FAFAFA] px-4 py-5 text-xs text-foreground">
      <span className="font-mono text-black">
        ʕ•ᴥ•ʔ © Marcos Mendes {year}
      </span>
    </footer>
  )
}


