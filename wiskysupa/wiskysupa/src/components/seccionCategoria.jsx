
function SeccionCategoria({ titulo, children }) {
    return (
        <section className="bg-info p-3 mb-4 rounded">
            <h3 className="border-bottom pb-2">{titulo}</h3>

            <div className="row g-3">
                {children}
            </div>
        </section>
    );
}

export default SeccionCategoria;
