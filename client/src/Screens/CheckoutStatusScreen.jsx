import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CheckoutStatusLayout from "../Components/checkout/CheckoutStatusLayout";
import OrderSummary from "../Components/checkout/OrderSummary";
import PaymentStatusBadge from "../Components/checkout/PaymentStatusBadge";
import { getOrder } from "../api/orders";
import "../Styles/checkout-status-page.css";

const POLL_DELAY_MS = 3000;
const POLL_LIMIT = 6;

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return "No disponible";

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const normalizeOrderStatus = (orderStatus, mercadoPagoStatus, expectedStatus) => {
  if (orderStatus === "paid") return "success";
  if (["cancelled", "refunded"].includes(orderStatus)) return "failure";
  if (["rejected", "cancelled", "refunded", "charged_back"].includes(mercadoPagoStatus)) {
    return "failure";
  }
  if (["approved", "accredited"].includes(mercadoPagoStatus)) return "success";
  if (expectedStatus === "failure") return "failure";
  return "pending";
};

const STATUS_COPY = {
  success: {
    eyebrow: "Checkout Pro",
    title: "Compra confirmada",
    description:
      "Mercado Pago aprobo la transaccion y tu orden ya quedo registrada en TRIPP NYC.",
    badge: "Pago aprobado",
  },
  failure: {
    eyebrow: "Checkout Pro",
    title: "Pago no aprobado",
    description:
      "La orden existe, pero Mercado Pago rechazo o cancelo el intento de pago. No se debe preparar el pedido.",
    badge: "Pago rechazado",
  },
  pending: {
    eyebrow: "Checkout Pro",
    title: "Pago pendiente",
    description:
      "Tu orden fue creada y estamos esperando la confirmacion final de Mercado Pago por webhook.",
    badge: "Pago pendiente",
  },
  error: {
    eyebrow: "Checkout Pro",
    title: "No pudimos cargar la orden",
    description:
      "La respuesta de Mercado Pago llego incompleta o el backend no encontro la orden solicitada.",
    badge: "Orden no disponible",
  },
};

const CheckoutStatusScreen = ({ expectedStatus = "pending" }) => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("external_reference") || searchParams.get("order_id");
  const paymentIdFromQuery =
    searchParams.get("payment_id") || searchParams.get("collection_id") || "";
  const mercadoPagoStatus =
    searchParams.get("status") || searchParams.get("collection_status") || "";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState(orderId ? "" : "Mercado Pago no envio el numero de orden.");
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!orderId) return undefined;

    let cancelled = false;
    let attempts = 0;
    let timeoutId;

    const loadOrder = async () => {
      try {
        const data = await getOrder(orderId);
        if (cancelled) return;

        setOrder(data);
        setError("");
        setLoading(false);

        const normalizedStatus = normalizeOrderStatus(
          data.status,
          mercadoPagoStatus,
          expectedStatus,
        );

        if (normalizedStatus === "pending" && attempts < POLL_LIMIT) {
          attempts += 1;
          setPolling(true);
          timeoutId = window.setTimeout(loadOrder, POLL_DELAY_MS);
          return;
        }

        setPolling(false);
      } catch (requestError) {
        if (cancelled) return;
        const statusCode = requestError?.response?.status;
        setError(
          statusCode === 404
            ? "La orden no existe o todavia no esta disponible."
            : "No se pudo obtener la informacion real de la orden.",
        );
        setLoading(false);
        setPolling(false);
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [expectedStatus, mercadoPagoStatus, orderId]);

  const normalizedStatus = useMemo(
    () => normalizeOrderStatus(order?.status, mercadoPagoStatus, expectedStatus),
    [expectedStatus, mercadoPagoStatus, order?.status],
  )

  const variant = error ? "error" : normalizedStatus;
  const copy = STATUS_COPY[variant];
  const paymentId = paymentIdFromQuery || order?.mp_payment_id || "";

  if (loading) {
    return (
      <CheckoutStatusLayout
        variant="pending"
        eyebrow="Checkout Pro"
        title="Cargando orden"
        description="Estamos consultando el backend para traer la informacion real de tu compra."
        badgeLabel="Consultando"
        actions={false}
      >
        <div className="checkout-status-page__loading-card">
          <div className="checkout-status-page__skeleton checkout-status-page__skeleton--short" />
          <div className="checkout-status-page__loading-stack">
            <div className="checkout-status-page__skeleton checkout-status-page__skeleton--row" />
            <div className="checkout-status-page__skeleton checkout-status-page__skeleton--row" />
            <div className="checkout-status-page__skeleton checkout-status-page__skeleton--large" />
          </div>
        </div>
      </CheckoutStatusLayout>
    )
  }

  return (
    <CheckoutStatusLayout
      variant={variant}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      badgeLabel={copy.badge}
    >
      <div className="checkout-status-page__meta-grid">
        <div className="checkout-status-page__meta-card">
          <p className="checkout-status-page__meta-label">Estado del pago</p>
          <div className="checkout-status-page__badge-slot">
            <PaymentStatusBadge status={variant} label={copy.badge} />
          </div>
        </div>
        <div className="checkout-status-page__meta-card">
          <p className="checkout-status-page__meta-label">Numero de orden</p>
          <p className="checkout-status-page__meta-value">#{order?.id || orderId || "-"}</p>
        </div>
        <div className="checkout-status-page__meta-card">
          <p className="checkout-status-page__meta-label">Payment ID</p>
          <p className="checkout-status-page__meta-value checkout-status-page__meta-value--wrap">
            {paymentId || "No informado"}
          </p>
        </div>
        <div className="checkout-status-page__meta-card">
          <p className="checkout-status-page__meta-label">Fecha de compra</p>
          <p className="checkout-status-page__meta-value">{formatDate(order?.created_at)}</p>
        </div>
      </div>

      {polling && (
        <div className="checkout-status-page__notice checkout-status-page__notice--pending">
          El pago esta pendiente. La pantalla se actualiza automaticamente mientras llega el webhook.
        </div>
      )}

      {error ? (
        <div className="checkout-status-page__notice checkout-status-page__notice--error">
          <p className="checkout-status-page__notice-title">Orden inexistente o no disponible</p>
          <p className="checkout-status-page__notice-text">{error}</p>
        </div>
      ) : (
        <>
          <OrderSummary order={order} />
          <div className="checkout-status-page__paid-total">
            <span className="checkout-status-page__paid-label">Total pagado</span>
            <span className="checkout-status-page__paid-value">{money(order?.total)}</span>
          </div>
        </>
      )}
    </CheckoutStatusLayout>
  )
}

export default CheckoutStatusScreen;
