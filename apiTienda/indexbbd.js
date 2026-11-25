import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Quejue");
});

app.get("/productos", async (req, res) => {
    const buscar = req.query.buscar;
    let consulta = supabase.from("productos").select("*");

    if (buscar) {
        consulta = consulta.ilike("nombre", "%" + buscar + "%");
    }

    const { data, error } = await consulta;
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

app.post("/productosAdd", async (req, res) => {
    try {
        // 1. Extraer los datos enviados en el cuerpo de la petición
        const { nombre, precio, categoria, stock } = req.body;

        // 2. Validar que no falten campos obligatorios
        if (!nombre || precio === undefined || !categoria || stock === undefined) {
            return res.status(400).json({ 
                error: "Todos los campos (nombre, precio, categoria, stock) son obligatorios" 
            });
        }

        // 3. Insertar el producto en tu tabla "productos" de Supabase
        const { data, error } = await supabase
            .from("productos")
            .insert([{ nombre, precio, categoria, stock }])
            .select();

        // 4. Si Supabase devuelve un error, enviarlo al catch
        if (error) {
            throw error;
        }

        // 5. Responder al cliente con éxito (Código 201: Creado)
        res.status(201).json({
            mensaje: "Producto creado exitosamente",
            producto: data[0] // Devuelve el objeto creado directamente
        });

    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ 
            error: "Error interno del servidor al guardar el producto",
            detalle: error.message 
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
