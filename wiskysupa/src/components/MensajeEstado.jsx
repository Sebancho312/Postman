function MensajeEstado({ tipo = "info", children, role }) {
    return (
        <p className={`status-message status-${tipo}`} role={role || (tipo === "error" || tipo === "success" ? "alert" : "status")}>
            {children}
        </p>
    );
}

export default MensajeEstado;
