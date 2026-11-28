import { Link } from "react-router-dom";

function NoEncontrada() {
    return (
        <section className="page-shell not-found-page" aria-labelledby="not-found-title">
            <p className="eyebrow">Página no encontrada</p>
            <div className="not-found-content">
                <p className="not-found-code" aria-hidden="true">404</p>
                <h1 id="not-found-title">Esta página no existe</h1>
                <p>El enlace puede haber cambiado. Vuelve al inicio para encontrar una cancha.</p>
                <Link className="button not-found-button" to="/">Volver al inicio</Link>
            </div>
        </section>
    );
}

export default NoEncontrada;
