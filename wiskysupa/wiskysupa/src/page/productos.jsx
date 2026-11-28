
import CardProducto from "../components/CardProducto";

function Productos({ productos, agregarAlCarrito }) {

    return (

        <div className="container-fluid bg-info p-3">

            <h1>Mi lista de Productos</h1>

            <h5 className="fw-bold">
                ¡Explora nuestra selección y encuentra el producto perfecto para ti!
            </h5>

            {/* Mostrar cada categoría */}
            {["Bebidas", "Snacks", "Accesorios"].map(categoria => (

                <div key={categoria}>

                    <h3 className="fw-bold border-bottom pb-2 mt-4">
                        {categoria}
                    </h3>

                    <div className="row g-3 mb-4">

                        {productos
                            .filter(producto =>
                                producto.categoria === categoria &&
                                producto.origen === "tienda"
                            )
                            .map(producto => (

                                <div className="col-md-4" key={producto.id}>

                                    <CardProducto
                                        producto={producto}
                                        agregarAlCarrito={agregarAlCarrito}
                                    />

                                </div>

                            ))}

                    </div>

                </div>

            ))}

        </div>

    );

}

export default Productos;
