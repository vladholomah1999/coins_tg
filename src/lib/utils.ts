export const formatBalance = (balance: bigint | number): string => {
  return new Intl.NumberFormat().format(Number(balance))
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('uk-UA').format(date)
}