import { api } from '@/services/authService'


function construirUrlReporte(path, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== null && value !== undefined && value !== ''
    )
  ).toString()
 
  return `${api.defaults.baseURL}${path}${query ? `?${query}` : ''}`
}

function abrirReporte(path, params = {}) {
  const url = construirUrlReporte(path, params)
  window.open(url, '_blank')
}


//genera la peticion para generar el reporte de provedores
export function generarReporteComprasPorProveedor({ fechaInicio, fechaFin }) {
  abrirReporte('/reportes/compras/por-proveedor', {
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
  abrirReporte('/reportes/ventas/resumen', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  })
}


//Funcino para obtener los productos mas vendidos
export function generarReporteProductosMasVendidos({ fechaInicio, fechaFin, limite }) {
  abrirReporte('/reportes/ventas/producto-mas-vendidos', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    limite: limite ?? null,
  })
}

//funcion para obeter las ventas por cajero
export function generarReporteVentasPorUsuario({ fechaInicio, fechaFin }) {
  abrirReporte('/reportes/ventas/usuarios', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  })
}

//Funccion para obtener las ventas por categoria
export function generarReporteVentasPorCategoria({ fechaInicio, fechaFin, categoriaId }) {
  abrirReporte('/reportes/ventas/categorias', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    categoria_id: categoriaId ?? null,
  })
}

//funcion para obtener las ventas comparativas
export function generarReporteComparativoVentas({ fechaInicio1, fechaFin1, fechaInicio2, fechaFin2 }) {
  abrirReporte('/reportes/ventas/resumen/comparativa', {
    fecha_inicio_1: fechaInicio1,
    fecha_fin_1: fechaFin1,
    fecha_inicio_2: fechaInicio2,
    fecha_fin_2: fechaFin2,
  })
}

//funccion para el margen de ganancia
export function generarReporteMargenGanancia({ fechaInicio, fechaFin }) {
  abrirReporte('/reportes/financieros/margen', {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  })
}
 
//funccion para flujo de ventas compras
export function generarReporteFlujoComprasVentas({ fechaDesde, fechaHasta }) {
  abrirReporte('/reportes/financieros/flujo', {
    fecha_desde: fechaDesde,
    fecha_hasta: fechaHasta,
  })
}

//funccion para el inveantrio valorizado
export function generarReporteInventarioValorizado({ categoriaId } = {}) {
  abrirReporte('/reportes/inventario/valorizado', {
    categoria_id: categoriaId ?? null,
  })
}

//funvcvion para obtener los productos por vences
export function generarReporteProductosPorVencer({ diasUmbral } = {}) {
  abrirReporte('/reportes/productos-por-vencer', {
    dias_umbral: diasUmbral ?? null,
  })
}