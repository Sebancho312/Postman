import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatoPrecio, obtenerCancha } from "../api";
import ImagenCancha from "../components/ImagenCancha";
import MensajeEstado from "../components/MensajeEstado";

function DetalleCancha() {
    const { id } = useParams();
    const [cancha, setCancha] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let activa = true;
        setCargando(true);
        obtenerCancha(id)
            .then((data) => { if (activa) setCancha(data); })
            .catch((err) => { if (activa) setError(err.message); })
            .finally(() => { if (activa) setCargando(false); });
        return () => { activa = false; };
    }, [id]);

    if (cargando) return <section className="page-shell"><MensajeEstado>Cargando información de la cancha...</MensajeEstado></section>;
    if (error) return <section className="page-shell"><MensajeEstado tipo="error">{error}</MensajeEstado><Link className="text-link" to="/canchas">Volver a canchas</Link></section>;

    return (
        <section className="page-shell detail-page" aria-labelledby="detail-title">
            <p className="eyebrow">Detalle de cancha</p>
            <Link className="text-link back-link" to="/canchas">← Volver a canchas</Link>
            <div className="detail-layout">
                <ImagenCancha nombre={cancha.nombre} deporte={cancha.deporte} principal />
                <div className="detail-copy">
                    <h1 id="detail-title">{cancha.nombre}</h1>
                    <p className="detail-sport">{cancha.deporte} · {cancha.ubicacion}</p>
                    <p className="detail-description">Consulta las características de esta cancha y elige el horario que mejor te convenga.</p>
                    <div className="detail-highlights">
                        <div><span>Capacidad</span><strong>{cancha.capacidad} personas</strong></div>
                        <div><span>Precio por hora</span><strong className="price">USD {formatoPrecio(cancha.precioPorHora)}</strong></div>
                    </div>
                    <p>Ubicación: {cancha.ubicacion}</p>
                    <p>Deporte: {cancha.deporte}</p>
                    <Link className="button button-full detail-cta" to={`/reserva/${cancha.id}`}>Reservar esta cancha</Link>
                </div>
            </div>
        </section>
    );
}

export default DetalleCancha;
