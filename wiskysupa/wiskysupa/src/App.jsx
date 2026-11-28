import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Encabezado from "./components/encabezado";
import Pie from "./components/pie";
import Inicio from "./page/inicio";
import Canchas from "./page/Canchas";
import DetalleCancha from "./page/DetalleCancha";
import ReservaCancha from "./page/ReservaCancha";
import NuevaCancha from "./page/NuevaCancha";
import NoEncontrada from "./page/NoEncontrada";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <Encabezado />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/inicio" element={<Navigate to="/" replace />} />
                        <Route path="/canchas" element={<Canchas />} />
                        <Route path="/canchas/:id" element={<DetalleCancha />} />
                        <Route path="/reserva/:id" element={<ReservaCancha />} />
                        <Route path="/nueva" element={<NuevaCancha />} />
                        <Route path="*" element={<NoEncontrada />} />
                    </Routes>
                </main>
                <Pie />
            </div>
        </BrowserRouter>
    );
}

export default App;
