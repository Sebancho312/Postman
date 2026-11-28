import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Configura SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en apiCanchas/.env");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);
const app = express();
app.use(cors());
app.use(express.json());

function fechaValida(fecha) {
    if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
    const valor = new Date(`${fecha}T00:00:00`);
    return !Number.isNaN(valor.getTime()) && valor.toISOString().slice(0, 10) === fecha;
}

function fechaPasada(fecha) {
    const ahora = new Date();
    const hoy = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
    return fecha < hoy;
}

function errorDB(res, error) {
    console.error("Error de Supabase:", error.message);
    return res.status(500).json({ error: "No se pudo completar la operación en la base de datos" });
}

app.get("/", (req, res) => res.json({
     mensaje: "API de canchas conectada a Supabase"
}));

app.get("/canchas", async (req, res) => {
    const { data, error } = await supabase.from("canchas")
        .select("id, nombre, deporte, ubicacion, capacidad, precio_por_hora").order("id");
    if (error) return errorDB(res, error);

    const buscar = String(req.query.buscar ?? "").trim().toLocaleLowerCase("es");
    const deporte = String(req.query.deporte ?? "").trim().toLocaleLowerCase("es");
    const resultado = data.filter((c) => {
        const texto = `${c.nombre} ${c.ubicacion}`.toLocaleLowerCase("es");
        return (!buscar || texto.includes(buscar)) &&
            (!deporte || c.deporte.toLocaleLowerCase("es") === deporte);
    }).map((c) => ({ ...c, precioPorHora: Number(c.precio_por_hora) }));
    res.json(resultado);
});

app.get("/canchas/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(404).json({ error: "Cancha no encontrada" });
    const { data, error } = await supabase.from("canchas")
        .select("id, nombre, deporte, ubicacion, capacidad, precio_por_hora")
        .eq("id", id).maybeSingle();
    if (error) return errorDB(res, error);
    if (!data) return res.status(404).json({ error: "Cancha no encontrada" });
    res.json({ ...data, precioPorHora: Number(data.precio_por_hora) });
});

app.get("/canchas/:id/disponibilidad", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) 
        return res.status(404).json({ error: "Cancha no encontrada" });
    const { fecha } = req.query;
    const duracionHoras = Number(req.query.duracionHoras ?? 1);
    if (!fechaValida(fecha) || fechaPasada(fecha)) {
        return res.status(400).json({ error: "Indica una fecha válida que no haya pasado" });
    }
    if (!Number.isInteger(duracionHoras) || duracionHoras < 1 || duracionHoras > 4) {
        return res.status(400).json({ error: "La duración debe ser de 1 a 4 horas" });
    }

    const { data: cancha, error: errorCancha } = await supabase.from("canchas")
        .select("id").eq("id", id).maybeSingle();
    if (errorCancha) 
        return errorDB(res, errorCancha);
    if (!cancha) 
        return res.status(404).json({ error: "Cancha no encontrada" });

    const { data, error } = await supabase.rpc("horarios_disponibles", {
        p_cancha_id: cancha.id, p_fecha: fecha, p_duracion_horas: duracionHoras,
    });
    if (error) return errorDB(res, error);
    res.json({
        canchaId: cancha.id, fecha, duracionHoras,
        horariosDisponibles: data.map((fila) => fila.hora_inicio)
    });
});

app.post("/canchas", async (req, res) => {
    const { nombre, deporte, ubicacion, capacidad, precioPorHora } = req.body ?? {};
    if (typeof nombre !== "string" || !nombre.trim() || typeof deporte !== "string" || !deporte.trim() ||
        typeof ubicacion !== "string" || !ubicacion.trim() || capacidad === undefined || precioPorHora === undefined) {
        return res.status(400).json({ error: "Nombre, deporte, ubicación, capacidad y precio por hora son obligatorios" });
    }
    const cap = Number(capacidad), precio = Number(precioPorHora);
    if (!Number.isInteger(cap) || cap < 1) return res.status(400).json({ error: "La capacidad debe ser un entero mayor que 0" });
    if (!Number.isFinite(precio) || precio < 0) return res.status(400).json({ error: "El precio por hora debe ser igual o mayor que 0" });

    const { data, error } = await supabase.from("canchas").insert({
        nombre: nombre.trim(), deporte: deporte.trim(), ubicacion: ubicacion.trim(),
        capacidad: cap, precio_por_hora: precio,
    }).select("id, nombre, deporte, ubicacion, capacidad, precio_por_hora").single();
    if (error) return errorDB(res, error);
    res.status(201).json({
        mensaje: "Cancha registrada correctamente",
        cancha: { ...data, precioPorHora: Number(data.precio_por_hora) }
    });
});

app.post("/reservas", async (req, res) => {
    const { canchaId, nombre, correo, fecha, horaInicio, duracionHoras, numeroPersonas } = req.body ?? {};
    if (canchaId === undefined || typeof nombre !== "string" || !nombre.trim() ||
        typeof correo !== "string" || !correo.trim() || fecha === undefined || horaInicio === undefined ||
        duracionHoras === undefined || numeroPersonas === undefined) {
        return res.status(400).json({ error: "Completa todos los datos de la reserva" });
    }
    const idCancha = Number(canchaId);
    if (!Number.isInteger(idCancha) || idCancha < 1) {
        return res.status(404).json({ error: "Cancha no encontrada" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
        return res.status(400).json({ error: "El correo electrónico no tiene un formato válido" });
    }
    if (!fechaValida(fecha) || fechaPasada(fecha)) {
        return res.status(400).json({ error: "La fecha debe ser válida y no puede estar en el pasado" });
    }
    if (typeof horaInicio !== "string" || !/^([01]\d|2[01]):00$/.test(horaInicio)) {
        return res.status(400).json({ error: "La hora de inicio debe estar entre 08:00 y 21:00" });
    }
    const duracion = Number(duracionHoras), personas = Number(numeroPersonas);
    if (!Number.isInteger(duracion) || duracion < 1 || duracion > 4 || Number(horaInicio.slice(0, 2)) + duracion > 22) {
        return res.status(400).json({ error: "La duración debe ser de 1 a 4 horas y finalizar antes de las 22:00" });
    }
    if (!Number.isInteger(personas) || personas < 1) {
        return res.status(400).json({ error: "El número de personas debe ser un entero mayor que 0" });
    }

    const { data, error } = await supabase.rpc("crear_reserva", {
        p_cancha_id: idCancha, p_nombre: nombre.trim(), p_correo: correo.trim(),
        p_fecha: fecha, p_hora_inicio: horaInicio, p_duracion_horas: duracion,
        p_numero_personas: personas,
    });
    if (error) {
        if (error.code === "P0002") return res.status(404).json({ error: "Cancha no encontrada" });
        if (["22023", "23P01"].includes(error.code)) return res.status(400).json({ error: error.message });
        return errorDB(res, error);
    }
    const r = Array.isArray(data) ? data[0] : data;
    res.status(201).json({
        mensaje: "Reserva registrada correctamente", reserva: {
            id: r.id, canchaId: r.cancha_id, nombre: r.nombre, correo: r.correo, fecha: r.fecha,
            horaInicio: r.hora_inicio, duracionHoras: r.duracion_horas,
            numeroPersonas: r.numero_personas, total: Number(r.total),
        }
    });
});

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && "body" in error) {
        return res.status(400).json({ error: "El cuerpo de la solicitud debe contener JSON válido" });
    }
    console.error("Error inesperado en la API:", error);
    res.status(500).json({ error: "Error interno del servidor" });
});

const puerto = process.env.PORT || 3001;
app.listen(puerto, () => console.log(`API de canchas activa en http://localhost:${puerto}`));
