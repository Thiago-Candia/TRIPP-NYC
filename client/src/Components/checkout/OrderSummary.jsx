import "../../Styles/order-summary.css";

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const OrderSummary = ({ order }) => {
  const items = order?.items || [];

  return (
    <section className="order-summary">
      <div className="order-summary__header">
        <div>
          <p className="order-summary__eyebrow">Resumen</p>
          <h2 className="order-summary__title">Productos comprados</h2>
        </div>
        <span className="order-summary__count">
          {items.length} item{items.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="order-summary__items">
        {items.length === 0 && (
          <div className="order-summary__empty">No hay productos asociados a esta orden.</div>
        )}

        {items.map((item) => (
          <div className="order-summary__item" key={item.id || `${item.name}-${item.sku}`}>
            <div className="order-summary__item-info">
              <p className="order-summary__item-name">{item.name}</p>
              <p className="order-summary__item-meta">
                Cantidad {item.quantity}
                {item.sku ? ` - SKU ${item.sku}` : ""}
              </p>
            </div>
            <div className="order-summary__item-price">
              <p className="order-summary__unit-price">{money(item.price)} c/u</p>
              <p className="order-summary__subtotal">{money(item.subtotal)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary__totals">
        <div className="order-summary__total-row">
          <span>Subtotal</span>
          <span>{money(order?.subtotal)}</span>
        </div>
        <div className="order-summary__total-row">
          <span>Shipping</span>
          <span>{Number(order?.shipping_cost || 0) === 0 ? "FREE" : money(order?.shipping_cost)}</span>
        </div>
        <div className="order-summary__total-row order-summary__total-row--final">
          <span>Total pagado</span>
          <span>{money(order?.total)}</span>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
