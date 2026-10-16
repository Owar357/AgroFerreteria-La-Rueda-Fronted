const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const entero = new Intl.NumberFormat('es-SV')

export const moneda = (valor) => usd.format(Number(valor) || 0)

export const numero = (valor) => entero.format(Number(valor) || 0)

/** 1250 -> $1.3k  |  500 -> $500 */
export function monedaCompacta(valor) {
  const n = Number(valor) || 0
  if (Math.abs(n) >= 1000) {
    const miles = n / 1000
    return `$${Number.isInteger(miles) ? miles : miles.toFixed(1)}k`
  }
  return `$${n}`
}

export const porcentaje = (valor) => `${Math.abs(Number(valor) || 0).toFixed(1)}%`

/** Acepta 'YYYY-MM-DD' (sin desfase de zona horaria) o un ISO completo. */
export function fechaCorta(valor) {
  if (!valor) return 'Sin fecha'
  const fecha =
    valor.length === 10
      ? new Date(...valor.split('-').map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))))
      : new Date(valor)
  return fecha.toLocaleDateString('es-SV', { day: '2-digit', month: 'short' })
}

export function fechaHora(valor) {
  if (!valor) return ''
  return new Date(valor).toLocaleString('es-SV', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function soloHora(valor) {
  if (!valor) return ''
  return new Date(valor).toLocaleTimeString('es-SV', { hour: 'numeric', minute: '2-digit' })
}