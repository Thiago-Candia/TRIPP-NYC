import { Link } from "react-router-dom";
import PaymentStatusBadge from "./PaymentStatusBadge";
import "../../Styles/checkout-status-layout.css";

const CheckoutStatusLayout = ({
  variant,
  eyebrow,
  title,
  description,
  badgeLabel,
  children,
  actions = true,
}) => {
  const statusVariant = ["success", "pending", "failure", "error"].includes(variant)
    ? variant
    : "pending";

  return (
    <main className={`checkout-status checkout-status--${statusVariant}`}>
      <div className="checkout-status__glow" />
      <div className="checkout-status__shell">
        <section className="checkout-status__panel">
          <div className="checkout-status__grid">
            <aside className="checkout-status__hero">
              <div className="checkout-status__hero-bg" />
              <div className="checkout-status__hero-content">
                <p className="checkout-status__eyebrow">{eyebrow}</p>
                <h1 className="checkout-status__title">{title}</h1>
                <p className="checkout-status__description">{description}</p>
              </div>
              <div className="checkout-status__badge-wrap">
                <PaymentStatusBadge status={statusVariant} label={badgeLabel} />
              </div>
            </aside>

            <div className="checkout-status__content">
              {children}

              {actions && (
                <div className="checkout-status__actions">
                  <Link to="/collections" className="checkout-status__button checkout-status__button--primary">
                    Volver a la tienda
                  </Link>
                  <Link to="/user" className="checkout-status__button checkout-status__button--ghost">
                    Ver mis ordenes
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CheckoutStatusLayout;
