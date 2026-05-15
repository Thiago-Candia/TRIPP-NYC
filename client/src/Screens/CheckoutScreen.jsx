import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { createOrder } from "../api/orders";
import Nav from "../Components/Nav";
import "../Styles/checkout.css";

const STEPS = ["Contact", "Shipping", "Review"];

const INITIAL_FORM = {
  email: "",
  phone: "",
  first_name: "",
  last_name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip_code: "",
  country: "AR",
};

const COUNTRIES = [
  { code: "AR", label: "Argentina" },
  { code: "US", label: "United States" },
  { code: "MX", label: "Mexico" },
  { code: "BR", label: "Brazil" },
  { code: "CL", label: "Chile" },
  { code: "UY", label: "Uruguay" },
];

const required = (val) => val.trim().length > 0;
const validEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

function validateStep(step, form) {
  const errors = {};
  if (step === 0) {
    if (!validEmail(form.email)) errors.email = "Enter a valid email address";
  }
  if (step === 1) {
    if (!required(form.first_name)) errors.first_name = "Required";
    if (!required(form.last_name)) errors.last_name = "Required";
    if (!required(form.address_line1)) errors.address_line1 = "Required";
    if (!required(form.city)) errors.city = "Required";
    if (!required(form.state)) errors.state = "Required";
    if (!required(form.zip_code)) errors.zip_code = "Required";
    if (!required(form.country)) errors.country = "Required";
  }
  return errors;
}

const CheckoutScreen = () => {
  const { cart, ensureServerCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const subtotal = Number(cart?.subtotal || 0);
  const shipping = subtotal >= 150 ? 0 : 12.99;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(step, form);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    setServerError("");
    try {
      const serverCart = await ensureServerCart();
      if (!serverCart?.items?.length) {
        setServerError("Your cart could not be synchronized. Add the product again before checkout.");
        return;
      }

      const payload = {
        ...form,
        subtotal: subtotal.toFixed(2),
        shipping_cost: shipping.toFixed(2),
        total: total.toFixed(2),
      };
      const data = await createOrder(payload);

      if (data.init_point) {
        window.location.href = data.init_point;
      } else if (data.order_id) {
        navigate(`/checkout/success?order_id=${data.order_id}`);
      }
    } catch (err) {
      console.error(err);
      console.error("checkout response", err?.response?.data);
      const responseData = err?.response?.data;
      const fieldErrors = responseData && typeof responseData === "object"
        ? Object.entries(responseData)
            .filter(([key]) => !["detail", "error"].includes(key))
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join(" | ")
        : "";
      setServerError(
        responseData?.detail ||
        responseData?.error ||
        fieldErrors ||
        "There was an error processing your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="checkout">
        <Nav />
        <div className="checkout__empty">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate("/collections")} className="checkout__empty-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <Nav />

      <main className="checkout__main">
        <div className="checkout__form-col">
          <div className="checkout__steps">
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <span
                  className={`checkout__step ${i === step ? "checkout__step--active" : ""} ${i < step ? "checkout__step--done" : ""}`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && <span className="checkout__step-sep">›</span>}
              </React.Fragment>
            ))}
          </div>

          {step === 0 && (
            <section className="checkout__section">
              <h2 className="checkout__section-title">Contact</h2>

              <div className="checkout__field">
                <label className="checkout__label" htmlFor="email">Email address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`checkout__input ${errors.email ? "checkout__input--error" : ""}`}
                  autoComplete="email"
                />
                {errors.email && <p className="checkout__error">{errors.email}</p>}
              </div>

              <div className="checkout__field">
                <label className="checkout__label" htmlFor="phone">Phone (optional)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+54 11 1234-5678"
                  className="checkout__input"
                  autoComplete="tel"
                />
              </div>

              <p className="checkout__privacy">
                We will send your order confirmation to this email.
              </p>
            </section>
          )}

          {step === 1 && (
            <section className="checkout__section">
              <h2 className="checkout__section-title">Shipping address</h2>

              <div className="checkout__row">
                <div className="checkout__field">
                  <label className="checkout__label" htmlFor="first_name">First name *</label>
                  <input
                    id="first_name" name="first_name" type="text"
                    value={form.first_name} onChange={handleChange}
                    className={`checkout__input ${errors.first_name ? "checkout__input--error" : ""}`}
                    autoComplete="given-name"
                  />
                  {errors.first_name && <p className="checkout__error">{errors.first_name}</p>}
                </div>
                <div className="checkout__field">
                  <label className="checkout__label" htmlFor="last_name">Last name *</label>
                  <input
                    id="last_name" name="last_name" type="text"
                    value={form.last_name} onChange={handleChange}
                    className={`checkout__input ${errors.last_name ? "checkout__input--error" : ""}`}
                    autoComplete="family-name"
                  />
                  {errors.last_name && <p className="checkout__error">{errors.last_name}</p>}
                </div>
              </div>

              <div className="checkout__field">
                <label className="checkout__label" htmlFor="address_line1">Address *</label>
                <input
                  id="address_line1" name="address_line1" type="text"
                  value={form.address_line1} onChange={handleChange}
                  placeholder="Street and number"
                  className={`checkout__input ${errors.address_line1 ? "checkout__input--error" : ""}`}
                  autoComplete="street-address"
                />
                {errors.address_line1 && <p className="checkout__error">{errors.address_line1}</p>}
              </div>

              <div className="checkout__field">
                <label className="checkout__label" htmlFor="address_line2">Apartment, suite, etc. (optional)</label>
                <input
                  id="address_line2" name="address_line2" type="text"
                  value={form.address_line2} onChange={handleChange}
                  className="checkout__input"
                />
              </div>

              <div className="checkout__row">
                <div className="checkout__field">
                  <label className="checkout__label" htmlFor="city">City *</label>
                  <input
                    id="city" name="city" type="text"
                    value={form.city} onChange={handleChange}
                    className={`checkout__input ${errors.city ? "checkout__input--error" : ""}`}
                    autoComplete="address-level2"
                  />
                  {errors.city && <p className="checkout__error">{errors.city}</p>}
                </div>
                <div className="checkout__field">
                  <label className="checkout__label" htmlFor="state">Province / State *</label>
                  <input
                    id="state" name="state" type="text"
                    value={form.state} onChange={handleChange}
                    className={`checkout__input ${errors.state ? "checkout__input--error" : ""}`}
                    autoComplete="address-level1"
                  />
                  {errors.state && <p className="checkout__error">{errors.state}</p>}
                </div>
              </div>

              <div className="checkout__row">
                <div className="checkout__field">
                  <label className="checkout__label" htmlFor="zip_code">ZIP / Postal code *</label>
                  <input
                    id="zip_code" name="zip_code" type="text"
                    value={form.zip_code} onChange={handleChange}
                    className={`checkout__input ${errors.zip_code ? "checkout__input--error" : ""}`}
                    autoComplete="postal-code"
                  />
                  {errors.zip_code && <p className="checkout__error">{errors.zip_code}</p>}
                </div>
                <div className="checkout__field">
                  <label className="checkout__label" htmlFor="country">Country *</label>
                  <select
                    id="country" name="country"
                    value={form.country} onChange={handleChange}
                    className={`checkout__input checkout__select ${errors.country ? "checkout__input--error" : ""}`}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="checkout__section">
              <h2 className="checkout__section-title">Review your order</h2>

              <div className="checkout__review-block">
                <p className="checkout__review-label">Contact</p>
                <p>{form.email}</p>
                {form.phone && <p>{form.phone}</p>}
              </div>

              <div className="checkout__review-block">
                <p className="checkout__review-label">Ship to</p>
                <p>{form.first_name} {form.last_name}</p>
                <p>{form.address_line1}{form.address_line2 ? `, ${form.address_line2}` : ""}</p>
                <p>{form.city}, {form.state} {form.zip_code}</p>
                <p>{COUNTRIES.find(c => c.code === form.country)?.label}</p>
              </div>

              <div className="checkout__review-block">
                <p className="checkout__review-label">Items</p>
                {cart.items.map((item) => (
                  <div key={item.id} className="checkout__review-item">
                    <span className="checkout__review-item-name">
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span>${Number(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {serverError && (
                <p className="checkout__server-error">{serverError}</p>
              )}
            </section>
          )}

          <div className="checkout__nav-btns">
            {step > 0 && (
              <button className="checkout__btn checkout__btn--back" onClick={handleBack}>
                ← Back
              </button>
            )}
            {step < 2 && (
              <button className="checkout__btn checkout__btn--next" onClick={handleNext}>
                Continue →
              </button>
            )}
            {step === 2 && (
              <button
                className="checkout__btn checkout__btn--pay"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Processing…" : "Pay with MercadoPago"}
              </button>
            )}
          </div>
        </div>

        <aside className="checkout__summary">
          <h3 className="checkout__summary-title">Order Summary</h3>

          <div className="checkout__summary-items">
            {cart.items.map((item) => (
              <div key={item.id} className="checkout__summary-item">
                <div className="checkout__summary-item-img-wrap">
                  {item.product?.primary_image ? (
                    <img
                      src={item.product.primary_image}
                      alt={item.product?.name}
                      className="checkout__summary-item-img"
                    />
                  ) : (
                    <div className="checkout__summary-item-img-placeholder" />
                  )}
                  <span className="checkout__summary-item-qty">{item.quantity}</span>
                </div>
                <div className="checkout__summary-item-info">
                  <p className="checkout__summary-item-name">{item.product?.name}</p>
                  {item.variant && (
                    <p className="checkout__summary-item-variant">
                      {[item.variant.size, item.variant.color].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <span className="checkout__summary-item-price">
                  ${Number(item.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout__summary-divider" />

          <div className="checkout__summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout__summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="checkout__summary-divider" />

          <div className="checkout__summary-row checkout__summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)} ARS</span>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default CheckoutScreen
