import api from '@/services/axios'

export async function obtenerResumenDashboard() {
  const { data } = await api.get('/dashboard/resumen')
  return data
}

export async function obtenerVentasCompras(anio) {
  const { data } = await api.get('/dashboard/ventas-compras', { params: { anio } })
  return data
}