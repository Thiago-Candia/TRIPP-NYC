import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "../Styles/account.css";

const AccountScreen = () => {
  const { user, login, register, canManageCatalog } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (user && canManageCatalog) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form.username, form.password);
      } else {
        await register(form);
      }
      navigate("/dashboard");
    } catch (error) {
      const backendDetail = error?.response?.data?.detail;
      setError(
        backendDetail ||
          (mode === "login" ? "Credenciales inválidas" : "No se pudo registrar")
      );
    }
  };

  return (
    <section className="account-page">
      <div className="account-card">
        <h1 className="account-card__title">{mode === "login" ? "Ingresar" : "Crear cuenta"}</h1>
        <p className="account-card__description">Accede como cliente para administrar tu tienda.</p>
        <form className="account-card__form" onSubmit={submit}>
          <input
            className="account-card__input"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            placeholder="Usuario"
            required
          />
          {mode === "register" && (
            <input
              className="account-card__input"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
            />
          )}
          <input
            className="account-card__input"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Contraseña"
            required
          />
          <button className="account-card__button" type="submit">{mode === "login" ? "Entrar" : "Registrarme"}</button>
        </form>
        <button
          className="account-card__button account-card__button--ghost"
          onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
        >
          {mode === "login" ? "No tengo cuenta" : "Ya tengo cuenta"}
        </button>
        {error && <small className="account-card__error">{error}</small>}
      </div>
    </section>
  );
};

export default AccountScreen;
