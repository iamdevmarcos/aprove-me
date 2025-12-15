export const mockQueryHook = <T,>(data: T, options = {}) => ({
  data,
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: null,
  ...options,
})

export const mockMutationHook = (options = {}) => ({
  mutate: jest.fn(),
  mutateAsync: jest.fn().mockResolvedValue({}),
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
  reset: jest.fn(),
  ...options,
})

export const mockUseAssignors = (data = [], options = {}) =>
  mockQueryHook(data, options)

export const mockUseCreateAssignor = (options = {}) =>
  mockMutationHook(options)

export const mockUsePayables = (data = [], options = {}) =>
  mockQueryHook(data, options)

export const mockUseCreatePayable = (options = {}) =>
  mockMutationHook(options)

