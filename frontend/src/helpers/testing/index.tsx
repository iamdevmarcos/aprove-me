import { render as rtlRender, RenderOptions } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactElement, ReactNode } from "react"

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface AllProvidersProps {
  children: ReactNode
}

export function AllProviders({ children }: AllProvidersProps) {
  const queryClient = createQueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  wrapper?: React.ComponentType<{ children: ReactNode }>
}

export function render(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return rtlRender(ui, {
    wrapper: options?.wrapper || AllProviders,
    ...options,
  })
}

export * from "@testing-library/react"
export { userEvent } from "@testing-library/user-event"

