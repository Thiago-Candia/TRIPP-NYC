const formatTablePrice = (value) => {
  const numericPrice = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(numericPrice) ? `$${numericPrice.toFixed(2)}` : "-";
};

const ProductTable = ({
  products,
  totalProducts,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  onDeleteImage,
  isDeleting,
}) => {
  return (
    <article className="dashboard-card">
      <div className="table-header">
        <div>
          <h2 className="dashboard-card__title">Productos</h2>
          <p className="dashboard-card__hint">
            {products.length} visibles de {totalProducts} productos
          </p>
        </div>
        <input
          className="dashboard-field table-header__search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre, SKU o categoria"
        />
      </div>
      <div className="table-wrap">
        <table className="dashboard-table">
          <thead className="dashboard-table__head">
            <tr className="dashboard-table__row">
              <th className="dashboard-table__th">Producto</th>
              <th className="dashboard-table__th">Precio</th>
              <th className="dashboard-table__th">Stock</th>
              <th className="dashboard-table__th">Estado</th>
              <th className="dashboard-table__th">Acciones</th>
            </tr>
          </thead>
          <tbody className="dashboard-table__body">
            {products.map((product) => (
              <tr className="dashboard-table__row" key={product.id}>
                <td className="dashboard-table__td dashboard-product-cell">
                  <div className="dashboard-product-cell__inner">
                    {product.primary_image && (
                      <img src={product.primary_image} alt={product.name} loading="lazy" />
                    )}
                    <div className="dashboard-product-cell__text">
                      <strong>{product.name}</strong>
                      <span>{product.sku || "Sin SKU"}</span>
                    </div>
                  </div>
                </td>
                <td className="dashboard-table__td dashboard-table__td--price">
                  <span className="dashboard-table__price">{formatTablePrice(product.price)}</span>
                </td>
                <td className="dashboard-table__td">{product.stock}</td>
                <td className="dashboard-table__td">
                  <span className={`status-pill ${product.is_active ? "status-pill--active" : ""}`}>
                    {product.is_active ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td className="dashboard-table__td">
                  <button className="dashboard-btn dashboard-btn--table" onClick={() => onEdit(product)}>
                    Editar
                  </button>
                  <button
                    className="dashboard-btn dashboard-btn--table"
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                  >
                    Eliminar
                  </button>
                  {product.images?.[0] && (
                    <button
                      className="dashboard-btn dashboard-btn--table"
                      onClick={() =>
                        onDeleteImage({
                          productId: product.id,
                          imageId: product.images[0].id,
                        })
                      }
                    >
                      Borrar imagen
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="dashboard-table__td" colSpan="5">
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default ProductTable;
