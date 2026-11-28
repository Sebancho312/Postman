import { Link } from "react-router-dom";
import ImagenCancha from "./ImagenCancha";
import { formatoPrecio } from "../api";

function TarjetaCancha({ cancha }) {
    return (
        <article className="court-card">
            <ImagenCancha nombre={cancha.nombre} deporte={cancha.deporte} />
            <div className="court-card-content">
                <h2>{cancha.nombre}</h2>
                <p>Ubicación: {cancha.ubicacion}</p>
                <p>Deporte: {cancha.deporte}</p>
                <p>Capacidad: {cancha.capacidad} personas</p>
                <p className="price">USD {formatoPrecio(cancha.precioPorHora)} / hora</p>
                <Link className="button button-full" to={`/canchas/${cancha.id}`}>Ver detalle</Link>
            </div>
        </article>
    );
}

export default TarjetaCancha;
