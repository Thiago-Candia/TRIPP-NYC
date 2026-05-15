import "../../Styles/payment-status-badge.css";

const STATUS_LABELS = {
  success: "Pago aprobado",
  pending: "Pago pendiente",
  failure: "Pago rechazado",
  error: "No disponible",
};

const PaymentStatusBadge = ({ status = "pending", label }) => {
  const badgeStatus = STATUS_LABELS[status] ? status : "pending";

  return (
    <span className={`payment-status-badge payment-status-badge--${badgeStatus}`}>
      <span className="payment-status-badge__dot" />
      {label || STATUS_LABELS[badgeStatus]}
    </span>
  );
};

export default PaymentStatusBadge;
