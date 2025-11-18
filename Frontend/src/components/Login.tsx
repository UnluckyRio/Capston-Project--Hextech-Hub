import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import "../styles/Home.scss";
import "../styles/login.scss";

// Il backend attende email e password in chiaro, non è richiesto CSRF custom

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signupSuccess: string | undefined = (location.state as any)?.signupSuccess;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const idValid = useMemo(() => {
    const trimmed = identifier.trim();
    if (!trimmed) return false;
    const looksEmail = /.+@.+\..+/.test(trimmed);
    return looksEmail;
  }, [identifier]);

  const canSubmit = idValid && password.length >= 6 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/auth/login", { email: identifier, password });
      const token: string | undefined = data?.token;
      if (!token) throw new Error("Token mancante nella risposta");
      login(token, remember);
      const redirectTo = (location.state as any)?.from?.pathname ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Unexpected error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-section login-page">
      <main className="container py-4" aria-labelledby="login-title">
        <h2 id="login-title" className="title mb-3">
          Login
        </h2>
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6">
          <form onSubmit={handleSubmit} aria-describedby="login-help">
            <div id="login-help" className="visually-hidden">
              Enter email/username and password to sign in.
            </div>

            <div className="mb-3">
              <label htmlFor="identifier" className="form-label text-light">
                Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                className="form-control"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                aria-invalid={!idValid}
                aria-describedby="identifier-help"
                required
              />
              <div id="identifier-help" className="form-text text-light">
                Usa la tua email (formato valido).
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-light">
                Password
              </label>
              <div className="input-group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  aria-describedby="password-help"
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div id="password-help" className="form-text text-light">
                At least 6 characters.
              </div>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="form-check-label text-light" htmlFor="remember">
                Remember me
              </label>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {signupSuccess && (
              // Mostra un messaggio di successo se si arriva dalla registrazione
              <div className="alert alert-success" role="alert">
                {signupSuccess}
              </div>
            )}

            <div className="d-flex align-items-center gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!canSubmit}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                Sign In
              </button>
              <button
                type="button"
                className="btn btn-warning text-dark"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>

            <div className="mt-3">
              <a href="#/forgot-password" className="link-info">
                Forgot password
              </a>
            </div>
          </form>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
