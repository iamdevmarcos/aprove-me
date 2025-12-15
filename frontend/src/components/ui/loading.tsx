export function Loading() {
  return (
    <div className="container mx-auto px-4 py-10 md:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div 
            className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" 
            style={{ animationDuration: '180ms' }}
          />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    </div>
  )
}

