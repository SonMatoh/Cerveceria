// ============================================================================
// Panel de administración: CRUD completo del inventario conectado
// al archivo de persistencia (inventarioStore).
// ============================================================================

import { useState } from 'react';
import { useStore } from '../hooks/useStore.js';
import {
  suscribirInventario,
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../data/inventarioStore.js';
import { obtenerCategorias } from '../data/inventarioStore.js';
import { formatoClp } from '../utils/imagenes.js';

const estadoInicialForm = {
  id: '',
  nombre: '',
  estilo: '',
  categoria: 'Cervezas',
  precio: '',
  descuento: '0',
  imagen: '',
  descripcion: '',
};

export default function Admin() {
  const productos = useStore(suscribirInventario, obtenerProductos);
  const categorias = useStore(suscribirInventario, obtenerCategorias);

  const [form, setForm] = useState(estadoInicialForm);
  const [mensaje, setMensaje] = useState('');

  const esEdicion = form.id !== '';

  const cambiar = (campo) => (evento) => {
    setForm((prev) => ({ ...prev, [campo]: evento.target.value }));
  };

  const valorInventario = productos.reduce((suma, p) => suma + Number(p.precio), 0);
  const enOferta = productos.filter((p) => Number(p.descuento) > 0).length;

  const editar = (producto) => {
    setForm({
      id: String(producto.id),
      nombre: producto.nombre,
      estilo: producto.estilo,
      categoria: producto.categoria,
      precio: String(producto.precio),
      descuento: String(producto.descuento),
      imagen: producto.imagen,
      descripcion: producto.descripcion,
    });
    setMensaje('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelar = () => {
    setForm(estadoInicialForm);
    setMensaje('');
  };

  const eliminar = (producto) => {
    if (window.confirm(`¿Seguro que deseas eliminar ${producto.nombre}?`)) {
      eliminarProducto(producto.id);
      setMensaje(`Producto "${producto.nombre}" eliminado.`);
      if (form.id === String(producto.id)) cancelar();
    }
  };

  const enviar = (evento) => {
    evento.preventDefault();

    const datos = {
      nombre: form.nombre.trim(),
      estilo: form.estilo.trim(),
      categoria: form.categoria,
      precio: Number(form.precio),
      descuento: Number(form.descuento),
      imagen: form.imagen.trim(),
      descripcion: form.descripcion.trim(),
    };

    if (!datos.nombre || !datos.precio) {
      setMensaje('⚠️ El nombre y el precio son obligatorios.');
      return;
    }

    if (esEdicion) {
      actualizarProducto(form.id, datos);
      setMensaje(`Producto "${datos.nombre}" actualizado correctamente.`);
    } else {
      crearProducto(datos);
      setMensaje(`Producto "${datos.nombre}" creado correctamente.`);
    }

    setForm(estadoInicialForm);
  };

  return (
    <div className="container py-5">
      <h1 className="h3 mb-4">Panel de administración</h1>

      {/* KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="fs-2 fw-bold text-primary">{productos.length}</div>
            <div className="text-secondary">Productos</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="fs-2 fw-bold text-danger">{enOferta}</div>
            <div className="text-secondary">En oferta</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="fs-4 fw-bold text-success">{formatoClp(valorInventario)}</div>
            <div className="text-secondary">Valor inventario (precio base)</div>
          </div>
        </div>
      </div>

      {mensaje && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {mensaje}
          <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Formulario CRUD */}
        <div className="col-lg-5">
          <form onSubmit={enviar} className="card border-0 shadow-sm p-4">
            <h2 className="h5 mb-3">
              {esEdicion ? 'Editar producto' : 'Añadir nuevo producto'}
            </h2>

            <input type="hidden" id="admin-id" value={form.id} readOnly />

            <div className="mb-3">
              <label htmlFor="admin-nombre" className="form-label">Nombre</label>
              <input
                id="admin-nombre"
                type="text"
                className="form-control"
                value={form.nombre}
                onChange={cambiar('nombre')}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="admin-estilo" className="form-label">Estilo</label>
              <input
                id="admin-estilo"
                type="text"
                className="form-control"
                value={form.estilo}
                onChange={cambiar('estilo')}
              />
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label htmlFor="admin-categoria" className="form-label">Categoría</label>
                <select
                  id="admin-categoria"
                  className="form-select"
                  value={form.categoria}
                  onChange={cambiar('categoria')}
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Nueva">+ Nueva categoría</option>
                </select>
              </div>
              <div className="col-3 mb-3">
                <label htmlFor="admin-precio" className="form-label">Precio</label>
                <input
                  id="admin-precio"
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.precio}
                  onChange={cambiar('precio')}
                  required
                />
              </div>
              <div className="col-3 mb-3">
                <label htmlFor="admin-descuento" className="form-label">Dto %</label>
                <input
                  id="admin-descuento"
                  type="number"
                  min="0"
                  max="90"
                  className="form-control"
                  value={form.descuento}
                  onChange={cambiar('descuento')}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="admin-imagen" className="form-label">Imagen (ruta)</label>
              <input
                id="admin-imagen"
                type="text"
                className="form-control"
                placeholder="imagenes/pika.png"
                value={form.imagen}
                onChange={cambiar('imagen')}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="admin-desc" className="form-label">Descripción</label>
              <textarea
                id="admin-desc"
                rows="3"
                className="form-control"
                value={form.descripcion}
                onChange={cambiar('descripcion')}
              ></textarea>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1">
                {esEdicion ? 'Guardar cambios' : 'Añadir producto'}
              </button>
              {esEdicion && (
                <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listado */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="h5 mb-3">Inventario ({productos.length})</h2>
            <div className="d-flex flex-column gap-2">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="border rounded p-3 d-flex flex-wrap align-items-center gap-2"
                >
                  <div className="flex-grow-1" style={{ minWidth: 200 }}>
                    <div className="fw-bold">{producto.nombre}</div>
                    <small className="text-secondary">{producto.estilo}</small>
                  </div>
                  <span className="badge text-bg-warning">{producto.categoria}</span>
                  <span className="fw-semibold text-primary">
                    {formatoClp(producto.precio)}
                  </span>
                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-outline-info btn-sm"
                      onClick={() => editar(producto)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => eliminar(producto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
