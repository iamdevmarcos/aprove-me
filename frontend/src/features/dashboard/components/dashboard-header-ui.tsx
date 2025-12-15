export function DashboardHeaderUI() {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1
          className="text-3xl font-bold -tracking-tighter"
          style={{ letterSpacing: "-2px" }}
        >
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Acompanhe seus recebíveis, cedentes e operações em um só lugar.
        </p>
      </div>
    </header>
  )
}
