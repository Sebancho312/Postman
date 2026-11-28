import { useEffect, useState } from "react";
import { listarCanchas } from "../api";
import TarjetaCancha from "../components/TarjetaCancha";
import MensajeEstado from "../components/MensajeEstado";

function Canchas() {
    const [buscar, setBuscar] = useState("");
    const [deporte, setDeporte] = useState("");
    const [canchas, setCanchas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        setCargando(true);
        setError("");

        listarCanchas({ buscar, deporte }, controller.signal)
            .then(setCanchas)
            .catch((err) => {
                if (err.name !== "AbortError") setError(err.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setCargando(false);
            });

        return () => controller.abort();
    }, [buscar, deporte]);

    return (
        <section className="page-shell listing-page" aria-labelledby="courts-title">
            <p className="eyebrow">Canchas deportivas</p>
            <h1 id="courts-title">Encuentra tu cancha</h1>
            <p className="lead listing-lead">Busca por nombre o ubicación y elige tu deporte.</p>

            <div className="filters">
                <div className="field">
                    <label htmlFor="buscar-cancha">Buscar cancha</label>
                    <input
                        id="buscar-cancha"
                        type="search"
                        placeholder="Nombre o ubicación"
                        value={buscar}
                        onChange={(event) => setBuscar(event.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="filtrar-deporte">Deporte</label>
                    <select id="filtrar-deporte" value={deporte} onChange={(event) => setDeporte(event.target.value)}>
                        <option value="">Todos los deportes</option>
                        <option value="Fútbol">Fútbol</option>
                        <option value="Baloncesto">Baloncesto</option>
                        <option value="Tenis">Tenis</option>
                        <option value="Vóley">Vóley</option>
                    </select>
                </div>
            </div>

            {cargando && <MensajeEstado>Cargando canchas...</MensajeEstado>}
            {error && <MensajeEstado tipo="error">{error}</MensajeEstado>}
            {!cargando && !error && (
                <>
                    <p className="result-count" aria-live="polite">
                        {canchas.length} {canchas.length === 1 ? "cancha disponible" : "canchas disponibles"} · Precios en USD
                    </p>
                    {canchas.length === 0 ? (
                        <MensajeEstado>No encontramos canchas con esos filtros. Prueba otra búsqueda.</MensajeEstado>
                    ) : (
                        <div className="court-grid">
                            {canchas.map((cancha) => <TarjetaCancha key={cancha.id} cancha={cancha} />)}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default Canchas;
