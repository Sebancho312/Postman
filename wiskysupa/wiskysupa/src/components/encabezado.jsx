import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Encabezado() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <header className="site-header">
            <div className="site-width header-inner">
                <Link className="brand" to="/" onClick={cerrarMenu} aria-label="Agencia de canchas, inicio">
                    <span className="brand-mark" aria-hidden="true">AC</span>
                    <span>Agencia de canchas</span>
                </Link>
                <button
                    className="menu-toggle"
                    type="button"
                    aria-expanded={menuAbierto}
                    aria-controls="main-navigation"
                    onClick={() => setMenuAbierto((abierto) => !abierto)}
                >
                    {menuAbierto ? "Cerrar" : "Menú"}
                </button>
                <nav id="main-navigation" className={`site-nav${menuAbierto ? " is-open" : ""}`} aria-label="Navegación principal">
                    <NavLink to="/" end onClick={cerrarMenu}>Inicio</NavLink>
                    <NavLink to="/canchas" onClick={cerrarMenu}>Canchas</NavLink>
                    <NavLink to="/nueva" onClick={cerrarMenu}>Registrar cancha</NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Encabezado;
