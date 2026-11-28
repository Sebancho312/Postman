import { Link } from "react-router-dom";
import ImagenCancha from "../components/ImagenCancha";

function Inicio() {
    return (
        <div className="page-shell home-page">
            <section className="home-hero" aria-labelledby="home-title">
                <div className="home-copy">
                    <p className="eyebrow">Espacios deportivos en Imbabura</p>
                    <h1 id="home-title">Tu próxima cancha empieza aquí</h1>
                    <p className="lead">Somos una agencia que conecta a tu equipo con espacios para jugar. Encuentra una cancha, consulta sus datos y prepara tu reserva.</p>
                    <Link className="button home-button" to="/canchas">Ver canchas</Link>
                </div>
                <ImagenCancha nombre="las canchas" principal />
            </section>

            <section className="home-intro" aria-labelledby="home-intro-title">
                <h2 id="home-intro-title">Encuentra tu lugar para jugar</h2>
                <p>Explora canchas de fútbol, básquetbol y tenis. Compara ubicación, capacidad y precio en un solo lugar.</p>
            </section>
        </div>
    );
}

export default Inicio;
