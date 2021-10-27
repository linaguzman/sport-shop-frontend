import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { obtenerVentas, registrarVentas, editarVentas} from '../utils/api';
import { nanoid } from 'nanoid';
import { Dialog, Tooltip } from '@material-ui/core';
import axios from 'axios';



const GestionarVentas = () => {

    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [ventas, setVentas] = useState([]);
    const [textoBoton, setTextoBoton] = useState('Insertar Nueva venta');
    const [colorBoton, setColorBoton] = useState('indigo');
    const [ejecutarConsulta, setEjecutarConsulta] = useState(true);
  
    useEffect(() => {
      console.log('consulta', ejecutarConsulta);
      if (ejecutarConsulta) {
        obtenerVentas(setVentas, setEjecutarConsulta);
      }
    }, [ejecutarConsulta]);
  
    useEffect(() => {
      //obtener lista de usuarios desde el backend
      if (mostrarTabla) {
        setEjecutarConsulta(true);
      }
    }, [mostrarTabla]);
  
    useEffect(() => {
      if (mostrarTabla) {
        setTextoBoton('Crear Nuevo venta');
        setColorBoton('green');
      } else {
        setTextoBoton('Mostrar todos las ventas');
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
          <TablaVentas listaVentas={ventas} setEjecutarConsulta={setEjecutarConsulta} />
        ) : (
          <FormularioCreacionVentas
            setMostrarTabla={setMostrarTabla}
            listaVentas={ventas}
            setVentas={setVentas}
          />
        )}
        <ToastContainer position='bottom-center' autoClose={5000} />
      </div>
    );
  };
  
  const TablaVentas = ({ listaVentas, setEjecutarConsulta }) => {
    const [busqueda, setBusqueda] = useState('');
    const [ventasFiltrados, setVentasFiltrados] = useState(listaVentas);
  
    useEffect(() => {
      setVentasFiltrados(
        listaVentas.filter((elemento) => {
          return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
        })
      );
    }, [busqueda, listaVentas]);
  
    return (
        <div>
        <Header/>
        <ul className="posicionBuscador"> 
                    <li>
                        <div className="label">Ingresa el ID de la venta:</div>
                        <input id="busqueda" type="text" value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Ingrese el dato"
                        />
                        <button className="botonBuscar" type="submit">Buscar</button>
                    </li>
                </ul>
        <div className="ventasTable">
          <table summary="Ventas registradas">
            <thead>
              <tr>
                <th>Id Venta</th>
                <th>Descripcion</th>
                <th>Precio venta</th>
                <th>Estado venta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltrados.map((venta) => {
                return (
                  <FilaVenta
                    key={nanoid()}
                    venta={venta}
                    setEjecutarConsulta={setEjecutarConsulta}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='flex flex-col w-full m-2 md:hidden'>
          {ventasFiltrados.map((el) => {
            return (
              <div className='bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl'>
                <span>{el.id_venta}</span>
                <span>{el.description}</span>
                <span>{el.price_venta}</span>
                <span>{el.status_venta}</span>
                
              </div>
            );
          })}
        </div>
        <Footer/>
      </div>
      
    );
  };
  
  const FilaVenta = ({ venta, setEjecutarConsulta }) => {
    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [infoNuevoVenta, setInfoNuevoVenta] = useState({
      _id_venta: venta._id_venta,
      description: venta.description,
      price_venta: venta.price_venta,
      status_venta: venta.status_venta,
     
    });
  
    const actualizarVenta = async () => {
      //enviar la info al backend
      const options = {
        method: 'PATCH',
        url: 'http://localhost:5000/usuario/editar',
        headers: { 'Content-Type': 'application/json' },
        data: { ...infoNuevoVenta, id:venta._id_venta },
      };
  
      await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          toast.success('Venta modificada con éxito');
          setEdit(false);
          setEjecutarConsulta(true);
        })
        .catch(function (error) {
          toast.error('Error modificando la venta');
          console.error(error);
        });
    };
  
    const eliminarVenta = async () => {
      const options = {
        method: 'DELETE',
        url: 'http://localhost:3001/ventas/eliminar',
        headers: { 'Content-Type': 'application/json' },
        data: { id: venta._id_venta },
      };
  
      await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          toast.success('Venta eliminada con éxito');
          setEjecutarConsulta(true);
        })
        .catch(function (error) {
          console.error(error);
          toast.error('Error eliminando la venta');
        });
      setOpenDialog(false);
    };
  
    return (
      <tr>
        {edit ? (
          <>
            <td>{infoNuevoVenta._id}</td>
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoVenta._id_venta}
                onChange={(e) => setInfoNuevoVenta({ ...infoNuevoVenta, _id_venta: e.target.value })}
              />
            </td>
  
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoVenta.description}
                onChange={(e) => setInfoNuevoVenta({ ...infoNuevoVenta, description: e.target.value })}
              />
            </td>
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoVenta.price_venta}
                onChange={(e) =>
                  setInfoNuevoVenta({ ...infoNuevoVenta, price_venta: e.target.value })
                }
              />
            </td>
  
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoVenta.status_venta}
                onChange={(e) =>
                  setInfoNuevoVenta({ ...infoNuevoVenta, status_venta: e.target.value })
                }
              />
            </td>
  
            
  
          </>
        ) : (
          <>
            <td>{venta._id.slice(23)}</td>
            <td>{venta.description}</td>
            <td>{venta.price_venta}</td>
            <td>{venta.status_venta}</td>
          </>
        )}
        <td>
          <div className='flex w-full justify-around'>
            {edit ? (
              <>
                <Tooltip title='Confirmar Edición' arrow>
                  <i
                    onClick={() => actualizarVenta()}
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
                <Tooltip title='Editar Venta' arrow>
                  <i
                    onClick={() => setEdit(!edit)}
                    className='fas fa-pencil-alt text-yellow-700 hover:text-yellow-500'
                  />
                </Tooltip>
                <Tooltip title='Eliminar Venta' arrow>
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
                ¿Está seguro de querer eliminar esta venta?
              </h1>
              <div className='flex w-full items-center justify-center my-4'>
                <button
                  onClick={() => eliminarVenta()}
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
  
  const FormularioCreacionVentas = ({ setMostrarTabla, listaVentas, setVentas }) => {
    const form = useRef(null);
  
    const submitForm = async (e) => {
      e.preventDefault();
      const fd = new FormData(form.current);
  
      const nuevoVenta = {};
      fd.forEach((value, key) => {
        nuevoVenta[key] = value;
      });
  
  
      const options = {
        method: 'POST',
        url: 'http://localhost:3001/ventas/nuevo',
        headers: { 'Content-Type': 'application/json' },
        data: { _id_venta: nuevoVenta._id_venta, description: nuevoVenta.description, price_venta: nuevoVenta.price_venta, status_venta: nuevoVenta.status_venta },
      };
  
      await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          toast.success('Agregando venta nueva');
        })
        .catch(function (error) {
          console.error(error);
          toast.error('Error al agregar venta');
         });
  
      setMostrarTabla(true);
    };
  
    return (

        <div className="container__all" id="container_all">
        <div class="cover">
      <div class="containe__cover">
        <div class="container__info">

        <h2>Ingresar Nueva Venta</h2>
        <form ref={form} onSubmit={submitForm} className='flex flex-col'>
          <label className='flex flex-col' htmlFor='descripcion venta'>
            Descripción venta
            <input
              name='descripcion'
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              placeholder='Descripcion'
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
  
          <label className='flex flex-col' htmlFor='status'>
            Estado de la venta
            <select
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              name='status'
              required
              defaultValue={0}
            >
              <option disabled value={0}>
                Seleccione Estado de la venta
              </option>
              <option>Entregada</option>
              <option>Cancelada</option>
              <option>En progreso</option>
            </select>
          </label>
          <button
            type='submit'
            className='col-span-3 bg-green-400 p-4 rounded-full shadow-md hover:bg-green-600 text-white'
          >
            Guardar Venta
          </button>
        </form>
        </div>
        </div>
        </div>
        <Footer/>
      </div>
      
    );
  };


export default GestionarVentas;