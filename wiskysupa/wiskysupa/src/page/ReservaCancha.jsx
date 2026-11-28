import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { consultarDisponibilidad, fechaLocalHoy, formatoPrecio, obtenerCancha, registrarReserva } from "../api";
import MensajeEstado from "../components/MensajeEstado";

const formularioInicial = {
    nombre: "",
    correo: "",
    fecha: "",
    horaInicio: "",
    duracionHoras: "1",
    numeroPersonas: "1",
};

function ReservaCancha() {
    const { id } = useParams();
    const [cancha, setCancha] = useState(null);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [horarios, setHorarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [cargandoHorarios, setCargandoHorarios] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        let activa = true;
        obtenerCancha(id)
            .then((data) => { if (activa) setCancha(data); })
            .catch((err) => { if (activa) setError(err.message); })
            .finally(() => { if (activa) setCargando(false); });
        return () => { activa = false; };
    }, [id]);

    useEffect(() => {
        if (!cancha || !formulario.fecha) {
            setHorarios([]);
            setFormulario((previo) => ({ ...previo, horaInicio: "" }));
            return undefined;
        }

        const controller = new AbortController();
        setCargandoHorarios(true);
        setError("");
        consultarDisponibilidad(cancha.id, formulario.fecha, formulario.duracionHoras, controller.signal)
            .then((data) => {
                if (!controller.signal.aborted) {
                    setHorarios(data.horariosDisponibles);
                    setFormulario((previo) => ({
                        ...previo,
                        horaInicio: data.horariosDisponibles.includes(previo.horaInicio)
                            ? previo.horaInicio
                            : "",
                    }));
                }
            })
            .catch((err) => {
                if (!controller.signal.aborted) setError(err.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setCargandoHorarios(false);
            });
        return () => controller.abort();
    }, [cancha, formulario.fecha, formulario.duracionHoras]);

    function actualizar(campo, valor) {
        setFormulario((previo) => ({ ...previo, [campo]: valor }));
        setError("");
        setMensaje("");
    }

    async function enviarReserva(event) {
        event.preventDefault();
        setError("");
        setMensaje("");

        const personas = Number(formulario.numeroPersonas);
        if (personas < 1 || personas > cancha.capacidad) {
            setError(`El número de personas debe estar entre 1 y ${cancha.capacidad}.`);
            return;
        }
        if (!horarios.includes(formulario.horaInicio)) {
            setError("Elige uno de los horarios disponibles para esta fecha.");
            return;
        }

        setGuardando(true);
        try {
            const resultado = await registrarReserva({
                canchaId: Number(cancha.id),
                nombre: formulario.nombre.trim(),
                correo: formulario.correo.trim(),
                fecha: formulario.fecha,
                horaInicio: formulario.horaInicio,
                duracionHoras: Number(formulario.duracionHoras),
                numeroPersonas: personas,
            });
            setMensaje(`Reserva confirmada. Costo total: USD ${formatoPrecio(resultado.reserva.total)}.`);
            setFormulario(formularioInicial);
            setHorarios([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setGuardando(false);
        }
    }

    if (cargando) return <section className="page-shell"><MensajeEstado>Cargando información de la cancha...</MensajeEstado></section>;
    if (!cancha) return <section className="page-shell"><MensajeEstado tipo="error">{error || "No se encontró esta cancha."}</MensajeEstado><Link className="text-link" to="/canchas">Volver a canchas</Link></section>;

    const total = Number(cancha.precioPorHora) * Number(formulario.duracionHoras || 0);

    return (
        <section className="page-shell reservation-page" aria-labelledby="reservation-title">
            <p className="eyebrow">Reserva</p>
            <h1 id="reservation-title">Reserva tu cancha</h1>

            <div className="reservation-layout">
                <aside className="selection-card" aria-label="Cancha seleccionada">
                    <h2>Tu selección</h2>
                    <h3>{cancha.nombre}</h3>
                    <p>Deporte: {cancha.deporte}</p>
                    <p>Ubicación: {cancha.ubicacion}</p>
                    <p>Capacidad: {cancha.capacidad} personas</p>
                    <p className="price">USD {formatoPrecio(cancha.precioPorHora)} / hora</p>
                    <Link className="text-link" to={`/canchas/${cancha.id}`}>Cambiar cancha</Link>
                </aside>

                <form className="reservation-form" onSubmit={enviarReserva}>
                    <h2>Datos de contacto</h2>
                    <div className="field">
                        <label htmlFor="reserva-nombre">Nombre completo</label>
                        <input id="reserva-nombre" autoComplete="name" required value={formulario.nombre}
                            onChange={(event) => actualizar("nombre", event.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="reserva-correo">Correo electrónico</label>
                        <input id="reserva-correo" type="email" autoComplete="email" required value={formulario.correo}
                            onChange={(event) => actualizar("correo", event.target.value)} />
                    </div>

                    <h2 className="form-section-title">Fecha y horario</h2>
                    <div className="form-grid-two">
                        <div className="field">
                            <label htmlFor="reserva-fecha">Fecha</label>
                            <input id="reserva-fecha" type="date" min={fechaLocalHoy()} required value={formulario.fecha}
                                onChange={(event) => actualizar("fecha", event.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="reserva-hora">Hora de inicio</label>
                            <select id="reserva-hora" required disabled={!formulario.fecha || cargandoHorarios || horarios.length === 0}
                                value={formulario.horaInicio} onChange={(event) => actualizar("horaInicio", event.target.value)}>
                                <option value="">{cargandoHorarios ? "Buscando horarios..." : "Elige un horario"}</option>
                                {horarios.map((hora) => <option key={hora} value={hora}>{hora}</option>)}
                            </select>
                        </div>
                    </div>
                    {formulario.fecha && !cargandoHorarios && !error && horarios.length === 0 && (
                        <MensajeEstado>No quedan horarios disponibles para esa fecha y duración.</MensajeEstado>
                    )}
                    <div className="form-grid-two">
                        <div className="field">
                            <label htmlFor="reserva-duracion">Duración</label>
                            <select id="reserva-duracion" value={formulario.duracionHoras}
                                onChange={(event) => actualizar("duracionHoras", event.target.value)}>
                                {[1, 2, 3, 4].map((horas) => <option key={horas} value={horas}>{horas} {horas === 1 ? "hora" : "horas"}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="reserva-personas">Personas</label>
                            <input id="reserva-personas" type="number" min="1" max={cancha.capacidad} step="1" required
                                value={formulario.numeroPersonas}
                                onChange={(event) => actualizar("numeroPersonas", event.target.value)} />
                        </div>
                    </div>
                    <small className="field-hint">Máximo: {cancha.capacidad} personas</small>

                    <div className="cost-summary" aria-live="polite">
                        <strong>Coste estimado: USD {formatoPrecio(total)}</strong>
                        <span>{formulario.duracionHoras} {Number(formulario.duracionHoras) === 1 ? "hora" : "horas"} × USD {formatoPrecio(cancha.precioPorHora)} / hora</span>
                    </div>
                    {error && <MensajeEstado tipo="error">{error}</MensajeEstado>}
                    {mensaje && <MensajeEstado tipo="success">{mensaje}</MensajeEstado>}
                    <button className="button button-full" type="submit" disabled={guardando || cargandoHorarios}>
                        {guardando ? "Guardando reserva..." : "Confirmar reserva"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default ReservaCancha;
