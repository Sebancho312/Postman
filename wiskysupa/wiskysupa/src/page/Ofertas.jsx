import { useState, useEffect } from 'react';
import TargetaOferta from "../components/TarjetaOferta";

function Ofertas({ productos, setProductos, agregarAlCarrito }) {

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        let cancelar = false;

        const cargarProductos = async () => {

            try {

                const response = await fetch(
                    "https://dummyjson.com/products?limit=8"
                );

                if (!response.ok) {
                    throw new Error("Error al consultar los productos");
                }

                const data = await response.json();

                // Obtener los productos de la API
                const productosAPI = data.products.map(producto => ({

                    id: `api-${producto.id}`,
                    nombre: producto.title,
                    precio: producto.price,
                    stock: producto.stock,
                    imagen: producto.thumbnail,
                    descuento: producto.discountPercentage,
                    categoria: "Catalogo Web",
                    origen: "api"

                }));

                if (!cancelar) {

                    // Actualizar el inventario general
                    setProductos(prevProductos => {

                        let productosActualizados = prevProductos.map(producto => {

                            let productoAPI = productosAPI.find(
                                p => p.id === producto.id
                            );

                            if (productoAPI) {
                                return {
                                    ...producto,
                                    ...productoAPI
                                };
                            }

                            return producto;

                        });

                        // Agregar productos que todavía no existen
                        let productosNuevos = productosAPI.filter(producto =>
                            !prevProductos.some(p => p.id === producto.id)
                        );

                        return [
                            ...productosActualizados,
                            ...productosNuevos
                        ];

                    });

                }

            } catch (error) {

                console.log(error);

                if (!cancelar) {
                    setError("No se pudieron cargar los productos");
                }

            } finally {

                if (!cancelar) {
                    setCargando(false);
                }

            }

        };

        cargarProductos();

        return () => {
            cancelar = true;
        };

    }, [setProductos]);

    let productosAPI = productos.filter(
        producto => producto.origen === "api"
    ).slice(0, 8);


    let ahorroTotal = 0;

    for (let i = 0; i < productosAPI.length; i++) {

        let precio = Number(productosAPI[i].precio) || 0;

        let descuento = Number(productosAPI[i].descuento) || 0;

        let valorDescuento = precio * descuento / 100;

        ahorroTotal = ahorroTotal + valorDescuento;

    }

    return (

        <div className="container mt-4 mb-4">

            <h2 className="text-center mb-4 text-white">
                Catálogo de Ofertas
            </h2>

            {cargando ? (

                <p className="text-center text-white">
                    Cargando productos...
                </p>

            ) : error ? (

                <p className="text-danger text-center">
                    {error}
                </p>

            ) : (

                <>

                    {/* Ahorro total */}
                    <div className="alert alert-success text-center mb-4">

                        <h5 className="fw-bold mb-0">

                            Si compras uno de cada producto, ahorras $
                            {ahorroTotal.toFixed(2)}

                        </h5>

                    </div>

                    {/* Tarjetas de productos */}
                    <div className="row g-4">

                        {productosAPI.map(producto => (

                            <div
                                className="col-12 col-sm-6 col-lg-4 d-flex"
                                key={producto.id}
                            >

                                <TargetaOferta
                                    producto={producto}
                                    agregar={(precioFinal) =>
                                        agregarAlCarrito({
                                            id: producto.id,
                                            nombre: producto.nombre,
                                            precio: precioFinal,
                                            descuento: 0
                                        })
                                    }
                                />
                            </div>

                        ))}

                    </div>

                </>

            )}

        </div>

    );

}

export default Ofertas;
