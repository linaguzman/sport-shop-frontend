import React from 'react'
import { Link } from "react-router-dom";

const Header = () => {
    return (
    <div>
        <header id="header">
        <div className="container__header">
        <div className="logo">
            <img src="tecno.png" alt="" />
          </div>
          <div className="container__nav">
            
          <div class="menu_bar">
            <a href="#" class="bt-menu"><span class="icon-list2"></span></a>
            </div>
            
            <nav id="nav">
            <ul>
                <Link to='/Ventas'><li className="botonNavbar"><span className= "icon-ventas"></span>Ventas</li></Link>
                <Link to='/GestionarProductos'><li className="botonNavbar"><span className= "icon-"></span>Productos</li></Link>
                <Link to='/GestionarUsuarios'><li className="botonNavbar"><span className= "icon-"></span>Usuarios</li></Link>
                <Link to='/'><button type="submit" className="botonSalir"><span className= "icon-"></span>Salir</button></Link>           
            </ul>
            </nav>
              
          </div>
        </div>
      </header>
    </div>
    )
};

export default Header


