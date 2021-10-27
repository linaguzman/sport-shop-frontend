import axios from 'axios';

/*---------VENTAS-------------- */

export const obtenerVentas = async (setVentas, setEjecutarConsulta) => {
  const options = { method: 'GET',
  url: 'http://localhost:3001/ventas'};
  await axios
  .request(options)
  .then(function(response){
    setVentas(response.data);
  })
  .catch(function(error){
    console.error(error);
  })
};

/*---------PRODUCTOS------------*/

export const obtenerProductos = async (setProductos, setEjecutarConsulta) => {
  const options = { method: 'GET',
  url: 'http://localhost:3001/productos'};
  await axios
  .request(options)
  .then(function(response){
    setProductos(response.data);
  })
  .catch(function(error){
    console.error(error);
  })
};

/*---------USUARIOS-------------*/

export const obtenerUsuarios = async (setUsuarios, setEjecutarConsulta) => {
  const options = { method: 'GET',
  url: 'http://localhost:3001/usuarios'};
  await axios
  .request(options)
  .then(function(response){
    setUsuarios(response.data);
  })
  .catch(function(error){
    console.error(error);
  })
};

