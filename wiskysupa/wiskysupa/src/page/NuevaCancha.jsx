import { useState } from "react";
import { registrarCancha } from "../api";
import MensajeEstado from "../components/MensajeEstado";

const valoresIniciales = { nombre: "", deporte: "", ubicacion: "", capacidad: "", precioPorHora: "" };

function NuevaCancha() {
    const [valores, setValores] = useState(valoresIniciales);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    function actualizar(campo, valor) {
        setValores((previo) => ({ ...previo, [campo]: valor }));
        setError("");
        setMensaje("");
    }

    async function enviar(event) {
        event.preventDefault();
        const capacidad = Number(valores.capacidad);
        const precioPorHora = Number(valores.precioPorHora);
        if (!Number.isInteger(capacidad) || capacidad < 1) {
            setError("La capacidad debe ser un número entero mayor que cero.");
            return;
        }
        if (!Number.isFinite(precioPorHora) || precioPorHora < 0) {
            setError("Ingresa un precio por hora igual o mayor que cero.");
            return;
        }

        setGuardando(true);
        try {
            const resultado = await registrarCancha({ ...valores, capacidad, precioPorHora });
            setMensaje(`${resultado.cancha.nombre} se registró correctamente.`);
            setValores(valoresIniciales);
        } catch (err) {
            setError(err.message);
        } finally {
            setGuardando(false);
        }
    }

    return (
        <section className="page-shell register-page" aria-labelledby="register-title">
            <p className="eyebrow">Administración</p>
            <div className="register-intro">
                <h1 id="register-title">Registrar cancha</h1>
                <p className="lead">Completa los datos del espacio que quieres ofrecer.</p>
            </div>

            <form className="register-form" onSubmit={enviar}>
                <div className="field">
                    <label htmlFor="cancha-nombre">Nombre de la cancha</label>
                    <input id="cancha-nombre" required maxLength="100" placeholder="Escribe el nombre" value={valores.nombre}
                        onChange={(event) => actualizar("nombre", event.target.value)} />
                </div>
                <div className="field">
                    <label htmlFor="cancha-deporte">Deporte</label>
                    <select id="cancha-deporte" required value={valores.deporte}
                        onChange={(event) => actualizar("deporte", event.target.value)}>
                        <option value="">Selecciona un deporte</option>
                        <option>Fútbol</option>
                        <option>Baloncesto</option>
                        <option>Tenis</option>
                        <option>Vóley</option>
                        <option>Otro</option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="cancha-ubicacion">Ubicación</label>
                    <input id="cancha-ubicacion" required maxLength="150" placeholder="Dirección o zona" value={valores.ubicacion}
                        onChange={(event) => actualizar("ubicacion", event.target.value)} />
                </div>
                <div className="field">
                    <label htmlFor="cancha-capacidad">Capacidad de personas</label>
                    <input id="cancha-capacidad" type="number" min="1" step="1" required placeholder="Número máximo de personas"
                        value={valores.capacidad} onChange={(event) => actualizar("capacidad", event.target.value)} />
                </div>
                <div className="field">
                    <label htmlFor="cancha-precio">Precio por hora (USD)</label>
                    <input id="cancha-precio" type="number" min="0" step="0.01" required placeholder="0.00"
                        value={valores.precioPorHora} onChange={(event) => actualizar("precioPorHora", event.target.value)} />
                </div>
                {error && <MensajeEstado tipo="error">{error}</MensajeEstado>}
                {mensaje && <MensajeEstado tipo="success">{mensaje}</MensajeEstado>}
                <button className="button button-full" type="submit" disabled={guardando}>
                    {guardando ? "Registrando..." : "Registrar cancha"}
                </button>
            </form>
        </section>
    );
}

export default NuevaCancha;
