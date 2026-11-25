
function TargetaOferta({ producto, agregar }) {

    let iva = 0.15;


    let descuento = Number(producto.descuento) || 0;

    let valorDescuento = producto.precio * descuento / 100;

    let precioAhora = producto.precio - valorDescuento;

    let valorIVA = precioAhora * iva;

    let precioFinal = precioAhora + valorIVA;

    let tipoOferta = descuento >= 10 ? "GRAN OFERTA" : "OFERTA";

    return (
        <div className="card shadow-sm h-100 w-100">

            <div className="p-3 text-center">
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "contain"
                    }}
                />
            </div>

            <div className="card-body d-flex flex-column">

                <h5 className="card-title fw-bold">
                    {producto.nombre}
                </h5>

                <div className="mb-3">
                    <span className={
                        descuento >= 10
                            ? "badge bg-danger"
                            : "badge bg-secondary"
                    }>
                        {tipoOferta}
                    </span>
                </div>

                    <tbody>
                        <tr>
                            <td>Antes</td>
                            <td >
                                ${Number(producto.precio).toFixed(2)}
                            </td>
                        </tr>

                        <tr>
                            <td>Descuento ({descuento.toFixed(2)}%)</td>
                            <td >
                                -${valorDescuento.toFixed(2)}
                            </td>
                        </tr>

                        <tr>
                            <td>Precio con descuento</td>
                            <td >
                                ${precioAhora.toFixed(2)}
                            </td>
                        </tr>

                        <tr>
                            <td>IVA (15%)</td>
                            <td >
                                ${valorIVA.toFixed(2)}
                            </td>
                        </tr>

                        <tr >
                            <td >Total</td>
                            <td >
                                ${precioFinal.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>

                <p>Stock disponible: {producto.stock}</p>

                <button
                    className="btn btn-primary w-100 mt-auto"
                    disabled={producto.stock <= 0}
                    onClick={() => agregar(precioAhora)}
                >
                    {producto.stock > 0
                        ? "Agregar al carrito"
                        : "Agotado"}
                </button>

            </div>
        </div>
    );
}

export default TargetaOferta;
