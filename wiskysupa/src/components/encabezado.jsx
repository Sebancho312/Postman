
import { Link } from 'react-router-dom';

function Encabezado({ titulo }) {

    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-light">

            <div className="container-fluid">

                <Link className="navbar-brand" to="/inicio">
                    Tienda
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav">

                        <li className="nav-item">
                            <Link className="nav-link" to="/inicio">
                                Inicio
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/productos">
                                Productos
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/contactos">
                                Contactos
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/compras">
                                Compras
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/catalogo">
                                Catalogo Web
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Ofertas">
                                Ofertas
                            </Link>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    );

}

export default Encabezado;
