
import Encabezado from './components/encabezado';
import Pie from './components/pie';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Inicio from './page/inicio';
import Contacto from './page/contactos';
import Productos from './page/productos';
import Compras from './page/compras';
import CatalogoWeb from './page/Catalogoweb';
import Ofertas from './page/Ofertas';

function App() {

    // Inventario general de la tienda
    const [productos, setProductos] = useState([

        { id: "local-1", nombre: "Whisky Escocés", precio: 20, stock: 15, categoria: "Bebidas", origen: "tienda" },
        { id: "local-2", nombre: "Ron Añejo", precio: 25, stock: 8, categoria: "Bebidas", origen: "tienda" },
        { id: "local-3", nombre: "Vodka Premium", precio: 40, stock: 0, categoria: "Bebidas", origen: "tienda" },

        { id: "local-4", nombre: "Papas Fritas", precio: 3, stock: 20, categoria: "Snacks", origen: "tienda" },
        { id: "local-5", nombre: "Chocolate", precio: 2, stock: 5, categoria: "Snacks", origen: "tienda" },
        { id: "local-6", nombre: "Galletas", precio: 3, stock: 0, categoria: "Snacks", origen: "tienda" },

        { id: "local-7", nombre: "Vaso de Whisky", precio: 10, stock: 12, categoria: "Accesorios", origen: "tienda" },
        { id: "local-8", nombre: "Coctelera", precio: 20, stock: 7, categoria: "Accesorios", origen: "tienda" },
        { id: "local-9", nombre: "Abrebotellas", precio: 5, stock: 0, categoria: "Accesorios", origen: "tienda" }

    ]);

    // Carrito de compras
    const [lista, setLista] = useState([]);

    // Historial de compras
    const [historialCompras, setHistorialCompras] = useState([]);

    // Datos del cliente
    const [cliente, setCliente] = useState({
        nombre: "",
        cedula: "",
        telefono: "",
        correo: "",
        direccion: "",
        fechaNacimiento: ""
    });

    // Agregar producto y descontar stock
    function agregarAlCarrito(producto) {

        let productoEncontrado = productos.find(
            p => p.id === producto.id
        );

        if (!productoEncontrado) {
            alert("No se encontró el producto en el inventario");
            return;
        }

        if (productoEncontrado.stock <= 0) {
            alert("Producto agotado");
            return;
        }

        // Descontar una unidad del inventario
        setProductos(productos.map(p =>
            p.id === producto.id
                ? { ...p, stock: p.stock - 1 }
                : p
        ));

        // Guardar el producto en el carrito
        setLista([...lista, producto]);

    }

    // Finalizar compra
    function finalizarCompra() {

        if (lista.length > 0) {

            const compra = {
                cliente: cliente,
                productos: lista
            };

            setHistorialCompras([...historialCompras, compra]);

            setLista([]);

            setCliente({
                nombre: "",
                cedula: "",
                telefono: "",
                correo: "",
                direccion: "",
                fechaNacimiento: ""
            });

        }

    }

    return (

        <BrowserRouter>

            <main className="container bg-primary">

                <section>

                    <Encabezado titulo="Wisky" />

                    <Routes>

                        <Route path="/" element={<Navigate to="/inicio" />} />

                        <Route path="/inicio" element={<Inicio />} />

                        <Route path="/contactos" element={<Contacto />} />

                        <Route
                            path="/productos"
                            element={
                                <Productos
                                    productos={productos}
                                    agregarAlCarrito={agregarAlCarrito}
                                />
                            }
                        />

                        <Route
                            path="/compras"
                            element={
                                <Compras
                                    lista={lista}
                                    cliente={cliente}
                                    setCliente={setCliente}
                                    finalizarCompra={finalizarCompra}
                                />
                            }
                        />

                        <Route
                            path="/catalogo"
                            element={
                                <CatalogoWeb
                                    productos={productos}
                                    setProductos={setProductos}
                                    agregarAlCarrito={agregarAlCarrito}
                                />
                            }
                        />

                        <Route
                            path="/ofertas"
                            element={
                                <Ofertas
                                    productos={productos}
                                    setProductos={setProductos}
                                    agregarAlCarrito={agregarAlCarrito}
                                />
                            }
                        />

                    </Routes>

                </section>

                <section>
                    <Pie />
                </section>

            </main>

        </BrowserRouter>

    );

}

export default App;
