export const mockAssignor = (overrides = {}) => ({
  id: "assignor-1",
  name: "Test Assignor",
  document: "12345678901",
  email: "test@test.com",
  phone: "11999999999",
  ...overrides,
})

export const mockPayable = (overrides = {}) => ({
  id: "payable-1",
  value: 1000,
  emissionDate: "2024-01-01",
  assignor: "assignor-1",
  ...overrides,
})

export const mockAssignors = (count = 2) =>
  Array.from({ length: count }, (_, i) =>
    mockAssignor({
      id: `assignor-${i + 1}`,
      name: `Assignor ${i + 1}`,
      document: i % 2 === 0 ? "12345678901" : "12345678000199",
    })
  )

export const mockPayables = (count = 2) =>
  Array.from({ length: count }, (_, i) =>
    mockPayable({
      id: `payable-${i + 1}`,
      value: 1000 * (i + 1),
      emissionDate: `2024-01-0${i + 1}`,
    })
  )

