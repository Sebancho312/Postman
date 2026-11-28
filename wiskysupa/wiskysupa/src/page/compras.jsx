
function Compras({ lista, cliente, setCliente, finalizarCompra }) {

    let subtotal = 0;
    let iva = 0;
    let ice = 0;
    let total = 0;

    const tarifaICE = 0.10;

    // Calcular edad del cliente
    function calcularEdad(fechaNacimiento) {

        if (!fechaNacimiento) {
            return 0;
        }

        let nacimiento = new Date(fechaNacimiento + "T00:00:00");
        let hoy = new Date();

        let edad = hoy.getFullYear() - nacimiento.getFullYear();

        let mes = hoy.getMonth() - nacimiento.getMonth();

        if (
            mes < 0 ||
            (mes === 0 && hoy.getDate() < nacimiento.getDate())
        ) {
            edad--;
        }

        return edad;

    }

    let edad = calcularEdad(cliente.fechaNacimiento);

    // Identificar bebidas alcohólicas
    function esLicor(nombre) {

        let nombreProducto = nombre.toLowerCase();

        return (
            nombreProducto.includes("whisky") ||
            nombreProducto.includes("ron") ||
            nombreProducto.includes("vodka")
        );

    }

    // Comprobar si existen licores
    let tieneLicor = lista.some(producto =>
        esLicor(producto.nombre)
    );

    // Comprobar restricción de edad
    let menorConLicor =
        cliente.fechaNacimiento !== "" &&
        edad < 18 &&
        tieneLicor;

    // Calcular subtotal aplicando descuentos
    lista.forEach(producto => {

        let descuento = producto.descuento || 0;

        let precioFinal = producto.precio -
            (producto.precio * descuento / 100);

        subtotal += precioFinal;

    });

    // Calcular impuestos
    if (edad > 65) {

        iva = subtotal * 0.08;
        ice = 0;

    } else if (edad >= 18) {

        iva = subtotal * 0.15;

        lista.forEach(producto => {

            if (esLicor(producto.nombre)) {

                let descuento = producto.descuento || 0;

                let precioFinal = producto.precio -
                    (producto.precio * descuento / 100);

                ice += precioFinal * tarifaICE;

            }

        });

    } else {

        iva = subtotal * 0.15;

    }

    total = subtotal + iva + ice;

    // Finalizar compra
    function confirmarCompra() {

        if (
            cliente.nombre === "" ||
            cliente.cedula === "" ||
            cliente.telefono === "" ||
            cliente.correo === "" ||
            cliente.direccion === "" ||
            cliente.fechaNacimiento === ""
        ) {

            alert("Por favor, complete todos los datos del cliente.");
            return;

        }

        if (edad < 0) {

            alert("La fecha de nacimiento no es válida.");
            return;

        }

        if (menorConLicor) {

            alert("No se pueden vender bebidas alcohólicas a menores de edad.");
            return;

        }

        finalizarCompra();

        alert("¡Compra realizada correctamente!");

    }

    return (

        <div className="container bg-info p-3">

            <h2 className="fw-bold">Mis Compras</h2>

            {/* DATOS DEL CLIENTE */}

            <div className="card shadow mb-4">

                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Datos del Cliente</h5>
                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-6">

                            <label className="form-label">
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                className="form-control mb-2"
                                value={cliente.nombre}
                                onChange={(e) => setCliente({
                                    ...cliente,
                                    nombre: e.target.value
                                })}
                            />

                            <label className="form-label">
                                Cédula
                            </label>

                            <input
                                type="text"
                                className="form-control mb-2"
                                value={cliente.cedula}
                                onChange={(e) => setCliente({
                                    ...cliente,
                                    cedula: e.target.value
                                })}
                            />

                            <label className="form-label">
                                Teléfono
                            </label>

                            <input
                                type="text"
                                className="form-control mb-2"
                                value={cliente.telefono}
                                onChange={(e) => setCliente({
                                    ...cliente,
                                    telefono: e.target.value
                                })}
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label">
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                className="form-control mb-2"
                                value={cliente.correo}
                                onChange={(e) => setCliente({
                                    ...cliente,
                                    correo: e.target.value
                                })}
                            />

                            <label className="form-label">
                                Dirección
                            </label>

                            <input
                                type="text"
                                className="form-control mb-2"
                                value={cliente.direccion}
                                onChange={(e) => setCliente({
                                    ...cliente,
                                    direccion: e.target.value
                                })}
                            />

                            <label className="form-label">
                                Fecha de nacimiento
                            </label>

                            <input
                                type="date"
                                className="form-control mb-2"
                                max={new Date().toISOString().split("T")[0]}
                                value={cliente.fechaNacimiento}
                                onChange={(e) => setCliente({
                                    ...cliente,
                                    fechaNacimiento: e.target.value
                                })}
                            />

                            {cliente.fechaNacimiento !== "" && (
                                <p className="fw-bold mt-2">
                                    Edad del cliente: {edad} años
                                </p>
                            )}

                        </div>

                    </div>

                </div>

            </div>

            {/* AVISOS */}

            {menorConLicor && (

                <div className="alert alert-danger">
                    <strong>Venta no permitida:</strong> El cliente es menor de 18 años
                    y tiene bebidas alcohólicas en su compra.
                </div>

            )}

            {edad > 65 && (

                <div className="alert alert-success">
                    Cliente mayor de 65 años. Se aplica IVA del 8 %.
                </div>

            )}

            {/* PRODUCTOS */}

            <h4 className="fw-bold">Mis Productos</h4>

            <h5>Total de productos: {lista.length}</h5>

            <div className="row">

                {lista.map((producto, index) => (

                    <div className="col-md-4 mb-3" key={index}>

                        <div className="card h-100 shadow-sm">

                            <div className="card-body">

                                <h5 className="fw-bold">
                                    {producto.nombre}
                                </h5>

                                <p>
                                    Precio: ${producto.precio.toFixed(2)}
                                </p>

                                <p>
                                    Descuento: {producto.descuento || 0}%
                                </p>

                                <p>
                                    Precio final: ${
                                        (
                                            producto.precio -
                                            producto.precio * (producto.descuento || 0) / 100
                                        ).toFixed(2)
                                    }
                                </p>

                                {esLicor(producto.nombre) && (

                                    <span className="badge bg-warning text-dark">
                                        Bebida alcohólica
                                    </span>

                                )}

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            {/* RESUMEN */}

            <div className="row mt-3">

                <div className="col-md-6">

                    <div className="card shadow">

                        <div className="card-body">

                            <h4 className="fw-bold">
                                Resumen de Compra
                            </h4>

                            <p>
                                Subtotal: ${subtotal.toFixed(2)}
                            </p>

                            <p>
                                IVA ({edad > 65 ? "8%" : "15%"}):
                                ${iva.toFixed(2)}
                            </p>

                            {edad >= 18 && edad <= 65 && (

                                <p>
                                    ICE: ${ice.toFixed(2)}
                                </p>

                            )}

                            <hr />

                            <h5 className="fw-bold text-success">
                                Total: ${total.toFixed(2)}
                            </h5>

                            <button
                                className="btn btn-success w-100 mt-3"
                                onClick={confirmarCompra}
                                disabled={
                                    lista.length === 0 ||
                                    menorConLicor
                                }
                            >
                                Finalizar Compra
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Compras;
