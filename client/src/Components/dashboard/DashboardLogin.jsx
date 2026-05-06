import { useState } from "react";

const DashboardLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onLogin(form.username, form.password);
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || "No se pudo iniciar sesion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="dashboard-auth">
      <form className="dashboard-login" onSubmit={submit}>
        <p className="dashboard-login__eyebrow">TRIPP NYC Admin</p>
        <h1>Panel de gestion</h1>
        <p>Ingresa con una cuenta admin para gestionar productos, imagenes y variantes.</p>
        <input
          className="dashboard-field"
          value={form.username}
          onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
          placeholder="Usuario"
          required
        />
        <input
          className="dashboard-field"
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder="Password"
          required
        />
        <button className="dashboard-btn dashboard-btn--primary" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar al dashboard"}
        </button>
        {error && <small className="dashboard-login__error">{error}</small>}
      </form>
    </section>
  );
};

export default DashboardLogin;
