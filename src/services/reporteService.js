import { api } from '@/services/authService'

function construirUrlReporte(path, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== null && value !== undefined && value !== ''
    )
  ).toString()

  return `${path}${query ? `?${query}` : ''}`
}

/**
 * Pide el PDF al backend usando axios (así sí viaja el header Authorization),
 * lo recibe como blob binario y lo abre en una pestaña nueva mediante un
 * Object URL. window.open(url) directo NO sirve para endpoints protegidos
 * por JWT porque una navegación de navegador no puede llevar headers
 * personalizados.
 */
async function abrirReporte(path, params = {}) {
  const url = construirUrlReporte(path, params)

  try {
    const response = await api.get(url, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const blobUrl = window.URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')

    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60_000)
  } catch (error) {
    // Si el backend devuelve un error (401, 404, 500...), con responseType
    // 'blob' axios también entrega ese error como Blob. Lo convertimos a
    // texto/JSON para poder mostrar el mensaje real en vez de un blob roto.
    if (error.response?.data instanceof Blob) {
      const texto = await error.response.data.text()
      let mensaje = texto
      try {
        mensaje = JSON.parse(texto).message ?? texto
      } catch {
        // el cuerpo no era JSON, dejamos el texto tal cual
      }
      console.error('Error al generar el reporte:', mensaje)
      throw new Error(mensaje)
    }
    console.error('Error al generar el reporte:', error)
    throw error
  }
}

//genera la peticion para generar el reporte de provedores
export function generarReporteComprasPorProveedor({ fechaInicio, fechaFin }) {
  return abrirReporte('/reportes/compras/por-proveedor', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  })
}

//Funcion para obtener las compras echas por proveedor (pinta la tabla)
export async function getComprasPorProveedor(filtros) {
  const res = await api.get('/reportes/compras/por-proveedor/datos', { params: filtros })
  return res.data.data ?? res.data ?? []
}

//Funcion paa obtener el resumen de las ventas
export function generarReporteResumenVentas({ fechaInicio, fechaFin }) {
  return abrirReporte('/reportes/ventas/resumen', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  })
}

//Funcino para obtener los productos mas vendidos
export function generarReporteProductosMasVendidos({ fechaInicio, fechaFin, limite }) {
  return abrirReporte('/reportes/ventas/producto-mas-vendidos', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    limite: limite ?? null,
  })
}

//funcion para obeter las ventas por cajero
export function generarReporteVentasPorUsuario({ fechaInicio, fechaFin }) {
  return abrirReporte('/reportes/ventas/usuarios', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  })
}

//Funccion para obtener las ventas por categoria
export function generarReporteVentasPorCategoria({ fechaInicio, fechaFin, categoriaId }) {
  return abrirReporte('/reportes/ventas/categorias', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    categoria_id: categoriaId ?? null,
  })
}

//funcion para obtener las ventas comparativas
export function generarReporteComparativoVentas({ fechaInicio1, fechaFin1, fechaInicio2, fechaFin2 }) {
  return abrirReporte('/reportes/ventas/resumen/comparativa', {
    fecha_inicio_1: fechaInicio1,
    fecha_fin_1: fechaFin1,
    fecha_inicio_2: fechaInicio2,
    fecha_fin_2: fechaFin2,
  })
}

//funccion para el margen de ganancia
export function generarReporteMargenGanancia({ fechaInicio, fechaFin }) {
  return abrirReporte('/reportes/financieros/margen', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  })
}

//funccion para flujo de ventas compras
export function generarReporteFlujoComprasVentas({ fechaDesde, fechaHasta }) {
  return abrirReporte('/reportes/financieros/flujo', {
    fecha_desde: fechaDesde,
    fecha_hasta: fechaHasta,
  })
}

//funccion para el inveantrio valorizado
export function generarReporteInventarioValorizado({ categoriaId } = {}) {
  return abrirReporte('/reportes/inventario/valorizado', {
    categoria_id: categoriaId ?? null,
  })
}

//funvcvion para obtener los productos por vences
export function generarReporteProductosPorVencer({ diasUmbral } = {}) {
  return abrirReporte('/reportes/productos-por-vencer', {
    dias_umbral: diasUmbral ?? null,
  })
}