import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { obtenerProductos, registrarProductos, editarProductos} from '../utils/api';
import { nanoid } from 'nanoid';
import { Dialog, Tooltip } from '@material-ui/core';
import axios from 'axios';



const GestionarProductos = () => {

    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [productos, setProductos] = useState([]);
    const [textoBoton, setTextoBoton] = useState('Insertar Nuevo producto');
    const [colorBoton, setColorBoton] = useState('indigo');
    const [ejecutarConsulta, setEjecutarConsulta] = useState(true);
  
    useEffect(() => {
      console.log('consulta', ejecutarConsulta);
      if (ejecutarConsulta) {
        obtenerProductos(setProductos, setEjecutarConsulta);
      }
    }, [ejecutarConsulta]);
  
    useEffect(() => {
      //obtener lista de productos desde el backend
      if (mostrarTabla) {
        setEjecutarConsulta(true);
      }
    }, [mostrarTabla]);
  
    useEffect(() => {
      if (mostrarTabla) {
        setTextoBoton('Crear Nuevo producto');
        setColorBoton('green');
      } else {
        setTextoBoton('Mostrar todos los productos');
        setColorBoton('indigo');
      }
    }, [mostrarTabla]);
  
    return (
        
      <div className='flex h-full w-full flex-col items-center justify-start p-10'>
          <Header/>
        <div className='flex flex-col w-full'>
          <button
            onClick={() => {
              setMostrarTabla(!mostrarTabla);
            }}
            className={`botonCrear`}
          >
            {textoBoton}
          </button>
        </div>
        {mostrarTabla ? (
          <TablaProductos listaProductos={productos} setEjecutarConsulta={setEjecutarConsulta} />
        ) : (
          <FormularioCreacionProductos
            setMostrarTabla={setMostrarTabla}
            listaProductos={productos}
            setProductos={setProductos}
          />
        )}
        <ToastContainer position='bottom-center' autoClose={5000} />
      </div>
    );
  };
  
  const TablaProductos = ({ listaProductos, setEjecutarConsulta }) => {
    const [busqueda, setBusqueda] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState(listaProductos);
  
    useEffect(() => {
      setProductosFiltrados(
        listaProductos.filter((elemento) => {
          return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
        })
      );
    }, [busqueda, listaProductos]);
  
    return (
        <div>
        <Header/>
        <ul className="posicionBuscador"> 
                    <li>
                        <div className="label">Ingresar el ID del producto:</div>
                        <input id="busqueda" type="text" value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Ingrese id"
                        />
                        <button className="botonBuscar" type="submit">Buscar</button>
                    </li>
                </ul>
        <div className="productosTable">
          <table summary="Productos registrados">
            <thead>
              <tr>
                <th>Id Producto</th>
                <th>Articulo</th>
                <th>Valor venta</th>
                <th>Estado venta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => {
                return (
                  <FilaProducto
                    key={nanoid()}
                    producto={producto}
                    setEjecutarConsulta={setEjecutarConsulta}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='flex flex-col w-full m-2 md:hidden'>
          {productosFiltrados.map((el) => {
            return (
              <div className='bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl'>
                <span>{el.id_producto}</span>
                <span>{el.article}</span>
                <span>{el.value_venta}</span>
                <span>{el.status_venta}</span>
                
              </div>
            );
          })}
        </div>
        <Footer/>
      </div>
      
    );
  };
  
  const FilaProducto = ({ producto, setEjecutarConsulta }) => {
    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [infoNuevoProducto, setInfoNuevoProducto] = useState({
      _id_producto: producto._id_producto,
      article: producto.article,
      value_venta: producto.value_venta,
      status_venta: producto.status_venta,
     
    });
  
    const actualizarProducto = async () => {
      //enviar la info al backend
      const options = {
        method: 'PATCH',
        url: 'http://localhost:3001/productos/editar',
        headers: { 'Content-Type': 'application/json' },
        data: { ...infoNuevoProducto, id: producto._id},
      };
  
      await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          toast.success('Producto modificado con éxito');
          setEdit(false);
          setEjecutarConsulta(true);
        })
        .catch(function (error) {
          toast.error('Error modificando el producto');
          console.error(error);
        });
    };
  
    const eliminarProducto = async () => {
      const options = {
        method: 'DELETE',
        url: 'http://localhost:3001/productos/eliminar',
        headers: { 'Content-Type': 'application/json' },
        data: { id: producto._id_producto },
      };
  
      await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          toast.success('Producto eliminado con éxito');
          setEjecutarConsulta(true);
        })
        .catch(function (error) {
          console.error(error);
          toast.error('Error eliminando el producto');
        });
      setOpenDialog(false);
    };
  
    return (
      <tr>
        {edit ? (
          <>
            <td>{infoNuevoProducto._id}</td>
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoProducto._id_producto}
                onChange={(e) => setInfoNuevoProducto({ ...infoNuevoProducto, _id_producto: e.target.value })}
              />
            </td>
  
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoProducto.article}
                onChange={(e) => setInfoNuevoProducto({ ...infoNuevoProducto, article: e.target.value })}
              />
            </td>
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoProducto.value_venta}
                onChange={(e) =>
                  setInfoNuevoProducto({ ...infoNuevoProducto, value_venta: e.target.value })
                }
              />
            </td>
  
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoProducto.status_venta}
                onChange={(e) =>
                  setInfoNuevoProducto({ ...infoNuevoProducto, status_venta: e.target.value })
                }
              />
            </td>
  
            
  
          </>
        ) : (
          <>
            <td>{producto._id.slice(23)}</td>
            <td>{producto.article}</td>
            <td>{producto.value_venta}</td>
            <td>{producto.status_venta}</td>
          </>
        )}
        <td>
          <div className='flex w-full justify-around'>
            {edit ? (
              <>
                <Tooltip title='Confirmar Edición' arrow>
                  <i
                    onClick={() => actualizarProducto()}
                    className='fas fa-check text-green-700 hover:text-green-500'
                  />
                </Tooltip>
                <Tooltip title='Cancelar edición' arrow>
                  <i
                    onClick={() => setEdit(!edit)}
                    className='fas fa-ban text-yellow-700 hover:text-yellow-500'
                  />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title='Editar Producto' arrow>
                  <i
                    onClick={() => setEdit(!edit)}
                    className='fas fa-pencil-alt text-yellow-700 hover:text-yellow-500'
                  />
                </Tooltip>
                <Tooltip title='Eliminar producto' arrow>
                  <i
                    onClick={() => setOpenDialog(true)}
                    className='fas fa-trash text-red-700 hover:text-red-500'
                  />
                </Tooltip>
              </>
            )}
          </div>
          <Dialog open={openDialog}>
            <div className='p-8 flex flex-col'>
              <h1 className='text-gray-900 text-2xl font-bold'>
                ¿Está seguro de querer eliminar este producto?
              </h1>
              <div className='flex w-full items-center justify-center my-4'>
                <button
                  onClick={() => eliminarProducto()}
                  className='mx-2 px-4 py-2 bg-green-500 text-white hover:bg-green-700 rounded-md shadow-md'
                >
                  Sí
                </button>
                <button
                  onClick={() => setOpenDialog(false)}
                  className='mx-2 px-4 py-2 bg-red-500 text-white hover:bg-red-700 rounded-md shadow-md'
                >
                  No
                </button>
              </div>
            </div>
          </Dialog>
        </td>
      </tr>
    );
  };
  
  const FormularioCreacionProductos = ({ setMostrarTabla, listaProductos, setProductos }) => {
    const form = useRef(null);
  
    const submitForm = async (e) => {
      e.preventDefault();
      const fd = new FormData(form.current);
  
      const nuevoProducto = {};
      fd.forEach((value, key) => {
        nuevoProducto[key] = value;
      });
  
  
      const options = {
        method: 'POST',
        url: 'http://localhost:3001/productos/nuevo',
        headers: { 'Content-Type': 'application/json' },
        data: { _id_producto: nuevoProducto._id_producto, article: nuevoProducto.article, value_venta: nuevoProducto.value_venta, status_venta: nuevoProducto.status_venta },
      };
  
      await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          toast.success('Agregando producto nuevo');
        })
        .catch(function (error) {
          console.error(error);
          toast.error('Error al agregar el producto');
         });
  
      setMostrarTabla(true);
    };
  
    return (

        <div className="container__all" id="container_all">
        <div class="cover">
      <div class="containe__cover">
        <div class="container__info">

        <h2>Ingresar Nuevo producto</h2>
        <form ref={form} onSubmit={submitForm} className='flex flex-col'>
          <label className='flex flex-col' htmlFor='producto des'>
            Descripción del producto
            <input
              name='articulo'
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              placeholder='Descripcion producto'
              required
            />
          </label>
          
          <label className='flex flex-col' htmlFor='precio'>
            Precio venta
            <input
              name='precio'
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              placeholder='precio'
              required
            />
          </label>
  
          <label className='flex flex-col' htmlFor='statusPro'>
            Estado del producto
            <select
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              name='status'
              required
              defaultValue={0}
            >
              <option disabled value={0}>
                Seleccione una opcion
              </option>
              <option>Disponible</option>
              <option>No disponible</option>
              <option>En progreso</option>
            </select>
          </label>
          <button
            type='submit'
            className='col-span-3 bg-green-400 p-4 rounded-full shadow-md hover:bg-green-600 text-white'
          >
            Guardar Producto
          </button>
        </form>
        </div>
        </div>
        </div>
        <Footer/>
      </div>
      
    );
  };


export default GestionarProductos;
