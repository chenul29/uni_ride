export function generateTicketNumber(): string {
  const values = new Uint32Array(1)
  crypto.getRandomValues(values)
  return String(100000 + (values[0] % 900000))
}

export function ticketNumberFromToken(token: string): string {
  const number = token.replace(/^UR/, '')
  return /^\d{6}$/.test(number) ? number : number.padStart(6, '0').slice(-6)
}

export function getTicketTokenFromQr(payload: string): string | null {
  const match = /^uniride:ticket:(UR\d{6})$/.exec(payload.trim())
  return match?.[1] || null
}
