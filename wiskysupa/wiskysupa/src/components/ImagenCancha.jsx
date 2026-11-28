import futbol from "../assets/canchas/futbol.jpg";
import baloncesto from "../assets/canchas/baloncesto.jpg";
import tenis from "../assets/canchas/tenis-v2.jpg";
import voley from "../assets/canchas/voley.jpg";

function imagenPorDeporte(deporte = "") {
    const nombre = deporte.toLocaleLowerCase("es");
    if (nombre.includes("baloncesto")) return baloncesto;
    if (nombre.includes("tenis")) return tenis;
    if (nombre.includes("vóley") || nombre.includes("voley")) return voley;
    return futbol;
}

function ImagenCancha({ nombre = "", deporte = "", principal = false }) {
    const source = imagenPorDeporte(deporte || "fútbol");
    const alt = principal && !deporte
        ? "Vista aérea de una cancha de fútbol"
        : `Cancha de ${deporte || "deportiva"}${nombre ? `: ${nombre}` : ""}`;

    return (
        <div className={`court-image${principal ? " court-image-large" : ""}`}>
            <img src={source} alt={alt} loading={principal ? "eager" : "lazy"} decoding="async" />
        </div>
    );
}

export default ImagenCancha;
