import Mask from "../masks"

describe("Mask.CPF", () => {
  it("should format valid CPF correctly", () => {
    expect(Mask.CPF("12345678901")).toBe("123.456.789-01")
  })

  it("should limit CPF to 11 digits", () => {
    expect(Mask.CPF("123456789012345")).toBe("123.456.789-01")
  })

  it("should remove non-numeric characters", () => {
    expect(Mask.CPF("123.456.789-01")).toBe("123.456.789-01")
  })

  it("should handle empty strings", () => {
    expect(Mask.CPF("")).toBe("")
  })

  it("should format partial CPF", () => {
    expect(Mask.CPF("123456")).toBe("123.456")
  })
})

describe("Mask.CNPJ", () => {
  it("should format valid CNPJ correctly", () => {
    expect(Mask.CNPJ("12345678901234")).toBe("12.345.678/9012-34")
  })

  it("should limit CNPJ to 14 digits", () => {
    expect(Mask.CNPJ("123456789012345678")).toBe("12.345.678/9012-34")
  })

  it("should remove non-numeric characters", () => {
    expect(Mask.CNPJ("12.345.678/9012-34")).toBe("12.345.678/9012-34")
  })

  it("should handle empty strings", () => {
    expect(Mask.CNPJ("")).toBe("")
  })

  it("should format partial CNPJ", () => {
    expect(Mask.CNPJ("1234567")).toBe("12.345.67")
  })
})

describe("Mask.phone", () => {
  it("should format phone with area code and 9 digits", () => {
    expect(Mask.phone("11999999999")).toBe("(11) 99999-9999")
  })

  it("should format phone with area code and 8 digits", () => {
    expect(Mask.phone("1133334444")).toBe("(11) 3333-4444")
  })

  it("should remove +55 prefix", () => {
    expect(Mask.phone("+5511999999999")).toBe("(11) 99999-9999")
  })

  it("should remove non-numeric characters", () => {
    expect(Mask.phone("(11) 99999-9999")).toBe("(11) 99999-9999")
  })

  it("should handle empty strings", () => {
    expect(Mask.phone("")).toBe("")
  })
})

describe("Mask.moneyInput", () => {
  it("should format positive value", () => {
    expect(Mask.moneyInput("1000.50")).toBe("R$ 1.000,50")
  })

  it("should format negative value", () => {
    expect(Mask.moneyInput("-500.25")).toBe("R$ - 500,25")
  })

  it("should format value without decimals", () => {
    expect(Mask.moneyInput("1000")).toBe("R$ 1.000,00")
  })

  it("should format value with cents", () => {
    expect(Mask.moneyInput("0.99")).toBe("R$ 0,99")
  })

  it("should format large values", () => {
    expect(Mask.moneyInput("1234567.89")).toBe("R$ 1.234.567,89")
  })
})

describe("Mask.removeMoneyInput", () => {
  it("should remove formatting and return numeric value", () => {
    expect(Mask.removeMoneyInput("R$ 1.000,50")).toBe("1000.50")
  })

  it("should return 0 for empty string", () => {
    expect(Mask.removeMoneyInput("")).toBe("0")
  })

  it("should handle values in cents", () => {
    expect(Mask.removeMoneyInput("R$ 0,50")).toBe("0.50")
  })

  it("should handle single digit values", () => {
    expect(Mask.removeMoneyInput("5")).toBe("0.05")
  })

  it("should handle two digit values", () => {
    expect(Mask.removeMoneyInput("50")).toBe("0.50")
  })

  it("should handle large values", () => {
    expect(Mask.removeMoneyInput("R$ 1.234.567,89")).toBe("1234567.89")
  })
})

describe("Mask.removeMaskCpf", () => {
  it("should remove CPF mask", () => {
    expect(Mask.removeMaskCpf("123.456.789-01")).toBe("12345678901")
  })

  it("should return empty string for empty input", () => {
    expect(Mask.removeMaskCpf("")).toBe("")
  })

  it("should remove all non-numeric characters", () => {
    expect(Mask.removeMaskCpf("123-456-789.01")).toBe("12345678901")
  })
})

describe("Mask.removeMaskCnpj", () => {
  it("should remove CNPJ mask", () => {
    expect(Mask.removeMaskCnpj("12.345.678/9012-34")).toBe("12345678901234")
  })

  it("should return empty string for empty input", () => {
    expect(Mask.removeMaskCnpj("")).toBe("")
  })

  it("should remove all non-numeric characters", () => {
    expect(Mask.removeMaskCnpj("12-345-678/9012-34")).toBe("12345678901234")
  })
})

