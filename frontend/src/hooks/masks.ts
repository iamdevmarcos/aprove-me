const maskCPF = (cpf: string) => {
  const cleanCPF = (cpf || '').replace(/\D/g, '')
  const cpfFormat = cleanCPF.length > 11 ? cleanCPF.slice(0, 11) : cleanCPF

  return cpfFormat
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

const maskCNPJ = (cnpj: string) => {
  const cleanCNPJ = (cnpj || '').replace(/\D/g, '')
  const cnpjFormat = cleanCNPJ.length > 14 ? cleanCNPJ.slice(0, 14) : cleanCNPJ

  return cnpjFormat
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

const phoneMask = (phoneNumber: string) => {
  return (phoneNumber || '')
    .replace('+55', '')
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
}

const maskMoneyInput = (input: string) => {
  const aux = (input || '').replace(/[^-&&^\d&&^.]/g, '')
  let value = parseFloat(aux)

  let base = 'R$ '
  if (value < 0) {
    value = value * -1
    base += '- '
  }
  const valueWithMask = value.toFixed(2).split('.')
  valueWithMask[0] = base + valueWithMask[0].split(/(?=(?:...)*$)/).join('.')
  return valueWithMask.join(',')
}

const removeMaskMoneyInput = (value: string) => {
  if (!value) return '0'
  const returnValue = value.replace(/[\D]+/g, '')

  switch (returnValue.length) {
    case 1:
      return `0.0${returnValue}`
    case 2:
      return `0.${returnValue}`
    default:
      return `${returnValue.slice(
        0,
        returnValue.length - 2
      )}.${returnValue.slice(returnValue.length - 2)}`
  }
}

const removeMaskCpf = (cpf: string) => {
  return (cpf || '').replace(/\D/g, '')
}

const removeMaskCnpj = (cnpj: string) => {
  return (cnpj || '').replace(/\D/g, '')
}

const Mask = {
  CPF: maskCPF,
  CNPJ: maskCNPJ,
  phone: phoneMask,
  moneyInput: maskMoneyInput,
  removeMoneyInput: removeMaskMoneyInput,
  removeMaskCpf,
  removeMaskCnpj,
}

export default Mask

export type MaskType = keyof typeof Mask
