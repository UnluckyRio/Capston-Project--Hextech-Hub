import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import "../styles/Home.scss";
import "../styles/signup.scss";

// Il backend Spring espone POST /api/auth/register e si aspetta la password in chiaro;
// niente CSRF custom né hashing lato client: l'hashing viene fatto lato server (BCrypt)

const SignUp = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const nameValid = useMemo(
    () => /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/.test(nome.trim()),
    [nome]
  );
  const surnameValid = useMemo(
    () => /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/.test(cognome.trim()),
    [cognome]
  );
  const emailValid = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);
  const riotValid = useMemo(
    () => /^[A-Za-z0-9_.\s]{3,16}#[A-Za-z0-9]{3,5}$/.test(riotId.trim()),
    [riotId]
  );
  const regionValid = useMemo(
    () => ["NA", "EUW", "EUNE"].includes(region),
    [region]
  );
  const passwordValid = useMemo(
    () => /(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}/.test(password),
    [password]
  );
  const confirmValid = useMemo(
    () => confirm === password && confirm.length > 0,
    [confirm, password]
  );
  const termsValid = terms === true;

  const canSubmit =
    nameValid &&
    surnameValid &&
    emailValid &&
    riotValid &&
    regionValid &&
    passwordValid &&
    confirmValid &&
    termsValid &&
    !loading;

  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      [
        "nome",
        "cognome",
        "email",
        "riotId",
        "region",
        "password",
        "confirm",
        "terms",
      ].forEach(markTouched);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Allinea al backend: /api/auth/signup con {email,password,fullName}
      const payload = {
        email: email.trim().toLowerCase(),
        password: password,
        fullName: `${nome.trim()} ${cognome.trim()}`.trim(),
        riotId: riotId.trim(),
        region: region as any,
      };
      await api.post("/api/auth/signup", payload);
      navigate("/login", { replace: true, state: { signupSuccess: "Account creato, effettua il login." } });
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Unexpected error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-section signup-page">
      <main className="container py-4" aria-labelledby="signup-title">
        <h2 id="signup-title" className="title mb-3">
          Sign Up
        </h2>
        <p className="text-light">Create your account.</p>
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6">
            <form onSubmit={handleSubmit} aria-describedby="signup-help">
              <div id="signup-help" className="visually-hidden">
                Fill in all required fields to register.
              </div>

              <div className="mb-3">
                <label htmlFor="nome" className="form-label text-light">
                  First Name
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  className={`form-control ${
                    touched.nome && !nameValid ? "is-invalid" : ""
                  }`}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={() => markTouched("nome")}
                  aria-invalid={touched.nome && !nameValid}
                  required
                />
                <div className="form-text text-light">
                  At least 2 characters.
                </div>
                {touched.nome && !nameValid && (
                  <div className="invalid-feedback">
                    Enter a valid first name.
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="cognome" className="form-label text-light">
                  Last Name
                </label>
                <input
                  id="cognome"
                  name="cognome"
                  type="text"
                  className={`form-control ${
                    touched.cognome && !surnameValid ? "is-invalid" : ""
                  }`}
                  value={cognome}
                  onChange={(e) => setCognome(e.target.value)}
                  onBlur={() => markTouched("cognome")}
                  aria-invalid={touched.cognome && !surnameValid}
                  required
                />
                <div className="form-text text-light">
                  At least 2 characters.
                </div>
                {touched.cognome && !surnameValid && (
                  <div className="invalid-feedback">
                    Enter a valid last name.
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label text-light">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${
                    touched.email && !emailValid ? "is-invalid" : ""
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched("email")}
                  aria-invalid={touched.email && !emailValid}
                  required
                />
                <div className="form-text text-light">Enter a valid email.</div>
                {touched.email && !emailValid && (
                  <div className="invalid-feedback">Invalid email.</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="riotId" className="form-label text-light">
                  Riot ID
                </label>
                <div className="input-group">
                  <input
                    id="riotId"
                    name="riotId"
                    type="text"
                    placeholder="SummonerName#TAG"
                    className={`form-control ${
                      touched.riotId && !riotValid ? "is-invalid" : ""
                    }`}
                    value={riotId}
                    onChange={(e) => setRiotId(e.target.value)}
                    onBlur={() => markTouched("riotId")}
                    aria-invalid={touched.riotId && !riotValid}
                    required
                  />
                </div>
                <div className="form-text text-light">
                  Format: Name#TAG (e.g., Faker#KR1).
                </div>
                {touched.riotId && !riotValid && (
                  <div className="invalid-feedback">Invalid Riot ID.</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="region" className="form-label text-light">
                  Region
                </label>
                <div role="group" aria-label="Select your region of origin">
                  <div className="region-select">
                    <button
                      type="button"
                      className={`region-btn ${
                        region === "NA" ? "active" : ""
                      }`}
                      onClick={() => setRegion("NA")}
                      onBlur={() => markTouched("region")}
                      aria-pressed={region === "NA"}
                      aria-label="North America"
                    >
                      <i className="bi bi-compass" aria-hidden="true"></i>
                      <span>NA</span>
                    </button>
                    <button
                      type="button"
                      className={`region-btn ${
                        region === "EUW" ? "active" : ""
                      }`}
                      onClick={() => setRegion("EUW")}
                      onBlur={() => markTouched("region")}
                      aria-pressed={region === "EUW"}
                      aria-label="EU West"
                    >
                      <i className="bi bi-geo-alt" aria-hidden="true"></i>
                      <span>EU West</span>
                    </button>
                    <button
                      type="button"
                    className={`region-btn ${
                        region === "EUNE" ? "active" : ""
                      }`}
                      onClick={() => setRegion("EUNE")}
                      onBlur={() => markTouched("region")}
                      aria-pressed={region === "EUNE"}
                      aria-label="EU Nordic/East"
                    >
                      <i className="bi bi-pin-map" aria-hidden="true"></i>
                      <span>EU Nordic/East</span>
                    </button>
                  </div>
                </div>
                {!regionValid && touched.region && (
                  <div className="invalid-feedback d-block">
                    Select a region to continue.
                  </div>
                )}
                <div className="form-text text-light">
                  Select your server region.
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
                    type={showPwd ? "text" : "password"}
                    className={`form-control ${
                      touched.password && !passwordValid ? "is-invalid" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => markTouched("password")}
                    minLength={8}
                    required
                    aria-describedby="password-help"
                    aria-invalid={touched.password && !passwordValid}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-pressed={showPwd}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                <div id="password-help" className="form-text text-light">
                  At least 8 characters, with at least one uppercase, one
                  lowercase and one digit.
                </div>
                {touched.password && !passwordValid && (
                  <div className="invalid-feedback">
                    Password does not meet the requirements.
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="confirm" className="form-label text-light">
                  Confirm password
                </label>
                <div className="input-group">
                  <input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    className={`form-control ${
                      touched.confirm && !confirmValid ? "is-invalid" : ""
                    }`}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onBlur={() => markTouched("confirm")}
                    required
                    aria-invalid={touched.confirm && !confirmValid}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-pressed={showConfirm}
                    aria-label={
                      showConfirm ? "Hide confirmation" : "Show confirmation"
                    }
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                {touched.confirm && !confirmValid && (
                  <div className="invalid-feedback">
                    Passwords do not match.
                  </div>
                )}
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  onBlur={() => markTouched("terms")}
                  aria-invalid={touched.terms && !termsValid}
                  required
                />
                <label className="form-check-label text-light" htmlFor="terms">
                  I accept the{" "}
                  <a href="#/terms" className="link-info">
                    Terms of Service
                  </a>
                </label>
                {touched.terms && !termsValid && (
                  <div className="invalid-feedback d-block">
                    You must accept the Terms.
                  </div>
                )}
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="d-flex align-items-center gap-2">
                <button
                  type="submit"
                  className="btn btn-warning text-dark"
                  disabled={!canSubmit}
                  aria-busy={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
