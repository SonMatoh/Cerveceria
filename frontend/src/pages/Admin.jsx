import React, { useState, useEffect } from 'react';
import {
  guardarProductos,
  categoriasIniciales,
  formatoClp,
  obtenerUsuarios,
} from '../data/Products.js';
import ProductoService from '../services/ProductoService.js';
import OrdenService from '../services/OrdenService.js';

export function Admin() {
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const usuarios = obtenerUsuarios();

  const [idEdicion, setIdEdicion] = useState('');
  const [nombre, setNombre] = useState('');
  const [estilo, setEstilo] = useState('');
  const [categoria, setCategoria] = useState('Cervezas');
  const [precio, setPrecio] = useState('');
  const [descuento, setDescuento] = useState('0');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchProductos();
    fetchOrdenes();
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

  const limpiar = () => {
    setIdEdicion('');
    setNombre('');
    setEstilo('');
    setCategoria('Cervezas');
    setPrecio('');
    setDescuento('0');
    setImagen('');
    setDescripcion('');
  };

  const editar = (producto) => {
    setIdEdicion(producto.id);
    setNombre(producto.nombre || '');
    setEstilo(producto.estilo || '');
    setCategoria(producto.categoria || 'Cervezas');
    setPrecio(producto.precio ?? '');
    setDescuento(producto.descuento ?? '0');
    setImagen(producto.imagen || producto.imagenUrl || '');
    setDescripcion(producto.descripcion || '');
    setMensaje('');
  };

  const eliminar = async (id) => {
    try {
      await ProductoService.deleteProducto(id);
      fetchProductos();
      setMensaje('Producto eliminado.');
    } catch (error) {
      console.log('Error deleting producto:', error);
      setMensaje('Error al eliminar producto.');
    }
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!nombre || !precio) {
      setMensaje('El nombre y el precio son obligatorios.');
      return;
    }

    const datosProducto = {
      nombre,
      estilo,
      categoria,
      precio: Number(precio),
      stock: 10,
      descuento: Number(descuento),
      imagen: imagen || '/imagenes/pika.png',
      imagenUrl: imagen || '/imagenes/pika.png',
      descripcion,
    };

    if (idEdicion !== '') {
      ProductoService.updateProducto(idEdicion, datosProducto)
        .then(() => {
          fetchProductos();
          setMensaje('Producto actualizado correctamente.');
        })
        .catch((error) => {
          console.log('Error updating producto:', error);
          setMensaje('Error al actualizar producto.');
        });
    } else {
      ProductoService.createProducto(datosProducto)
        .then(() => {
          fetchProductos();
          setMensaje('Producto agregado correctamente.');
        })
        .catch((error) => {
          console.log('Error creating producto:', error);
          setMensaje('Error al crear producto.');
        });
    }

    limpiar();
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

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

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

            <div className="row">
              <div className="col-6 mb-2">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {categoriasIniciales.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-3 mb-2">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </div>
              <div className="col-3 mb-2">
                <label className="form-label">Dto %</label>
                <input
                  type="number"
                  className="form-control"
                  value={descuento}
                  onChange={(e) => setDescuento(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">Ruta Imagen</label>
              <input
                type="text"
                className="form-control"
                placeholder="/imagenes/pika.png"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
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
              <button type="submit" className="btn btn-primary w-100">
                {idEdicion !== '' ? 'Guardar cambios' : 'Agregar'}
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
                {ordenes.map((o, index) => (
                  <li key={index} className="list-group-item px-0">
                    <strong>{o.nroOrden || o.id}</strong> — {o.datos?.nombre || o.email || 'Cliente'} (
                    {formatoClp(o.total)}) [{o.estado}]
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="h5 mb-3">Usuarios Registrados</h2>
            <ul className="list-group list-group-flush small">
              {usuarios.map((u, index) => (
                <li key={index} className="list-group-item px-0">
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