import React, { useState, useEffect } from 'react';
import {
  guardarProductos,
  categoriasIniciales,
  formatoClp,
  obtenerUsuarios,
} from '../data/Products.js';
import ProductoService from '../services/ProductoService.js';
import OrdenService from '../services/OrdenService.js';
import CategoriaService from '../services/CategoriaService.js';
import AuthService from '../services/AuthService.js';

export function Admin() {
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [categorias, setCategorias] = useState(categoriasIniciales);
  const [usuarios, setUsuarios] = useState([]);

  const [idEdicion, setIdEdicion] = useState('');
  const [nombre, setNombre] = useState('');
  const [estilo, setEstilo] = useState('');
  const [categoria, setCategoria] = useState('Cervezas');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('10');
  const [descuento, setDescuento] = useState('0');
  const [imagen, setImagen] = useState('');
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [claveArchivo, setClaveArchivo] = useState(0);
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchOrdenes();
    fetchCategorias();
    fetchUsuarios();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await ProductoService.getAllProductos();
      if (Array.isArray(data)) {
        setProductos(data);
        guardarProductos(data);
      }
    } catch (error) {
      console.log('Error fetching productos:', error);
    }
  };

  const fetchOrdenes = async () => {
    try {
      const data = await OrdenService.listarOrdenes();
      if (Array.isArray(data)) {
        setOrdenes(data);
      } else {
        setOrdenes([]);
      }
    } catch (error) {
      console.log('Error fetching ordenes:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const data = await CategoriaService.listarCategorias();
      if (Array.isArray(data) && data.length > 0) {
        const nombres = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].nombre) {
            nombres.push(data[i].nombre);
          }
        }
        if (nombres.length > 0) {
          setCategorias(nombres);
        }
      }
    } catch (error) {
      setCategorias(categoriasIniciales);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await AuthService.listarUsuarios();
      if (Array.isArray(data) && data.length > 0) {
        setUsuarios(data);
      } else {
        setUsuarios(obtenerUsuarios());
      }
    } catch (error) {
      setUsuarios(obtenerUsuarios());
    }
  };

  const limpiar = () => {
    setIdEdicion('');
    setNombre('');
    setEstilo('');
    setCategoria('Cervezas');
    setPrecio('');
    setStock('10');
    setDescuento('0');
    setImagen('');
    setArchivoImagen(null);
    setClaveArchivo((prev) => prev + 1);
    setDescripcion('');
  };

  const editar = (producto) => {
    setIdEdicion(producto.id);
    setNombre(producto.nombre || '');
    setEstilo(producto.estilo || '');
    setCategoria(producto.categoria || 'Cervezas');
    setPrecio(producto.precio ?? '');
    setStock(producto.stock ?? 0);
    setDescuento(producto.descuento ?? '0');
    setImagen(producto.imagenUrl || producto.imagen || '');
    setArchivoImagen(null);
    setClaveArchivo((prev) => prev + 1);
    setDescripcion(producto.descripcion || '');
    setMensaje('');
    setEsError(false);
  };

  const eliminar = async (id) => {
    setMensaje('');
    setEsError(false);
    try {
      await ProductoService.deleteProducto(id);
      await fetchProductos();
      setMensaje('Producto eliminado.');
    } catch (error) {
      console.log('Error deleting producto:', error);
      setEsError(true);
      setMensaje(
        error.response?.data?.error || 'Error al eliminar producto.'
      );
    }
  };

  const guardar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setEsError(false);

    if (!nombre.trim() || precio === '') {
      setEsError(true);
      setMensaje('El nombre y el precio son obligatorios.');
      return;
    }

    if (Number(precio) < 0) {
      setEsError(true);
      setMensaje('El precio no puede ser negativo.');
      return;
    }

    if (stock === '' || Number(stock) < 0) {
      setEsError(true);
      setMensaje('El stock debe ser 0 o mayor.');
      return;
    }

    if (Number(descuento) < 0 || Number(descuento) > 100) {
      setEsError(true);
      setMensaje('El descuento debe estar entre 0 y 100.');
      return;
    }

    const datosProducto = {
      nombre: nombre.trim(),
      estilo: estilo.trim(),
      categoria,
      precio: Number(precio),
      stock: Number(stock),
      descuento: Number(descuento || 0),
      imagenUrl: imagen.trim(),
      descripcion: descripcion.trim(),
    };

    setGuardando(true);
    try {
      let productoGuardado;
      if (idEdicion !== '') {
        productoGuardado = await ProductoService.updateProducto(
          idEdicion,
          datosProducto
        );
      } else {
        productoGuardado = await ProductoService.createProducto(datosProducto);
      }

      let avisoImagen = '';
      if (archivoImagen && productoGuardado?.id) {
        try {
          await ProductoService.subirImagen(productoGuardado.id, archivoImagen);
        } catch (errImg) {
          avisoImagen =
            ' (Producto guardado, pero falló la subida de la imagen a ImgBB).';
        }
      }

      await fetchProductos();
      setMensaje(
        (idEdicion !== ''
          ? 'Producto actualizado correctamente.'
          : 'Producto agregado correctamente.') + avisoImagen
      );
      limpiar();
    } catch (error) {
      console.log('Error saving producto:', error);
      setEsError(true);
      const dataError = error.response?.data;
      if (dataError && dataError.campos) {
        setMensaje(Object.values(dataError.campos).join(' | '));
      } else {
        setMensaje(dataError?.error || 'Error al guardar el producto.');
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="h3 mb-4">Panel de Administración</h1>

      <div className="row g-3 mb-4 text-center">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <div className="fs-2 fw-bold text-primary">{ordenes.length}</div>
            <div className="text-secondary">Compras realizadas</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <div className="fs-2 fw-bold text-success">{productos.length}</div>
            <div className="text-secondary">Productos en inventario</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <div className="fs-2 fw-bold text-warning">{usuarios.length}</div>
            <div className="text-secondary">Usuarios registrados</div>
          </div>
        </div>
      </div>

      {mensaje && (
        <div className={`alert ${esError ? 'alert-danger' : 'alert-info'}`}>
          {mensaje}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-5">
          <form onSubmit={guardar} className="card border-0 shadow-sm p-4">
            <h2 className="h5 mb-3">
              {idEdicion !== '' ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            <div className="mb-2">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Estilo</label>
              <input
                type="text"
                className="form-control"
                value={estilo}
                onChange={(e) => setEstilo(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-4 mb-2">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </div>
              <div className="col-4 mb-2">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="col-4 mb-2">
                <label className="form-label">Dto %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  value={descuento}
                  onChange={(e) => setDescuento(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">URL Imagen (https://...)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://i.ibb.co/..."
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">O subir imagen a ImgBB</label>
              <input
                key={claveArchivo}
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => setArchivoImagen(e.target.files?.[0] || null)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                rows="2"
                className="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={guardando}
              >
                {guardando
                  ? 'Guardando...'
                  : idEdicion !== ''
                  ? 'Guardar cambios'
                  : 'Agregar'}
              </button>
              {idEdicion !== '' && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiar}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="h5 mb-3">Lista de Productos</h2>
            {productos.map((p) => (
              <div
                key={p.id}
                className="border-bottom py-2 d-flex justify-content-between align-items-center flex-wrap gap-2"
              >
                <div>
                  <strong>{p.nombre}</strong> ({p.categoria}) -{' '}
                  <span className="text-primary fw-bold">
                    {formatoClp(p.precio)}
                  </span>{' '}
                  <span className="badge text-bg-light border">
                    Stock: {p.stock ?? 0}
                  </span>
                </div>
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => editar(p)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => eliminar(p.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="h5 mb-3">Últimas Boletas / Órdenes</h2>
            {ordenes.length === 0 ? (
              <p className="text-secondary small mb-0">No hay compras registradas.</p>
            ) : (
              <ul className="list-group list-group-flush small">
                {ordenes.map((o, index) => {
                  const codigo =
                    o.nroOrden ||
                    (o.id ? 'ORDER-' + o.id : `#${index + 1}`);
                  const detalleItems = Array.isArray(o.items)
                    ? o.items
                        .map(
                          (it) =>
                            `${it.productoNombre || it.nombre} × ${it.cantidad}`
                        )
                        .join(', ')
                    : '';

                  return (
                    <li key={o.id || index} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{codigo}</strong>
                        <span className="badge text-bg-secondary">
                          {o.estado}
                        </span>
                      </div>
                      <div className="text-primary fw-semibold">
                        Total: {formatoClp(o.total || 0)}
                      </div>
                      {detalleItems && (
                        <div className="text-secondary">{detalleItems}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="h5 mb-3">Usuarios Registrados</h2>
            <ul className="list-group list-group-flush small">
              {usuarios.map((u, index) => (
                <li key={u.id || index} className="list-group-item px-0">
                  <strong>{u.nombre}</strong> — {u.email} ({u.rol})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;