import { useState, useEffect } from 'react';

function CatalogoWeb({ productos, setProductos, agregarAlCarrito }) {

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const cargarProductos = async () => {

            try {
                // 1. Cambiado a http (sin la 's') y a tu ruta '/productos'
                const response = await fetch("http://localhost:3000/productos");

                if (!response.ok) {
                    throw new Error("Error al consultar los productos");
                }

                const data = await response.json();

                // 2. Tu backend devuelve un arreglo directo (data), no data.products
                // Y las propiedades ya vienen en español desde Supabase
                const productosAPI = data.map(producto => ({
                    id: `api-${producto.id}`,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    stock: producto.stock,
                    // Imagen por defecto por si tu tabla aún no tiene columna de imagen
                    imagen: producto.imagen || "https://placeholder.com",
                    categoria: producto.categoria || "Catálogo Web",
                    origen: "api"
                }));

                // Agregar los productos al inventario general
                setProductos(prevProductos => {
                    let nuevosProductos = productosAPI.filter(producto =>
                        !prevProductos.some(p => p.id === producto.id)
                    );

                    return [...prevProductos, ...nuevosProductos];
                });

                console.log("Productos recibidos de Supabase:", productosAPI);

            } catch (error) {
                console.log(error);
                setError("No se pudieron cargar los productos del servidor");
            } finally {
                setCargando(false);
            }

        };

        if (!productos.some(p => p.origen === "api")) {
            cargarProductos();
        } else {
            setCargando(false);
        }

    }, []);

    let productosAPI = productos.filter(
        producto => producto.origen === "api"
    );

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4 text-white">
                Catálogo de Productos
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
                <div className="row">
                    {productosAPI.map(producto => (
                        <div className="col-md-4 mb-3" key={producto.id}>
                            <div className="card p-3 h-100">
                                <img
                                    src={producto.imagen}
                                    className="card-img-top"
                                    alt={producto.nombre}
                                    style={{
                                        height: "180px",
                                        objectFit: "contain"
                                    }}
                                />

                                <div className="card-body">
                                    <h5>{producto.nombre}</h5>
                                    <p className="text-muted small mb-1">{producto.categoria}</p>
                                    <p>Precio: ${producto.precio}</p>
                                    <p>Stock: {producto.stock}</p>

                                    <button
                                        className="btn btn-primary w-100"
                                        disabled={producto.stock <= 0}
                                        onClick={() => agregarAlCarrito({
                                            id: producto.id,
                                            nombre: producto.nombre,
                                            precio: producto.precio,
                                            descuento: 0
                                        })}
                                    >
                                        {producto.stock > 0
                                            ? "Agregar al carrito"
                                            : "Agotado"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CatalogoWeb;
