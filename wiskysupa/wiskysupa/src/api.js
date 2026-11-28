const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...options.headers,
            },
        });
    } catch (error) {
        if (error.name === "AbortError") throw error;
        throw new Error("No se pudo conectar con la API. Comprueba que el servidor esté iniciado.");
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Ocurrió un error al procesar la solicitud.");
    return data;
}

export function listarCanchas({ buscar = "", deporte = "" } = {}, signal) {
    const params = new URLSearchParams();
    if (buscar.trim()) params.set("buscar", buscar.trim());
    if (deporte) params.set("deporte", deporte);
    const query = params.toString();
    return request(`/canchas${query ? `?${query}` : ""}`, { signal });
}

export function obtenerCancha(id) {
    return request(`/canchas/${encodeURIComponent(id)}`);
}

export function consultarDisponibilidad(id, fecha, duracionHoras, signal) {
    const params = new URLSearchParams({ fecha, duracionHoras: String(duracionHoras) });
    return request(`/canchas/${encodeURIComponent(id)}/disponibilidad?${params}`, { signal });
}

export function registrarCancha(cancha) {
    return request("/canchas", { method: "POST", body: JSON.stringify(cancha) });
}

export function registrarReserva(reserva) {
    return request("/reservas", { method: "POST", body: JSON.stringify(reserva) });
}

export function fechaLocalHoy() {
    const ahora = new Date();
    return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 10);
}

export function formatoPrecio(valor) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(valor) || 0);
}
