import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setBusy(false);
    if (error) return setErr(error.message);

    nav("/blogs");
  };

  return (
    <div className="page">
      <div className="container container-sm">
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2>👋 Welcome Back</h2>
          <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={onSubmit} className="form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email"
                placeholder="your@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password"
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button disabled={busy} type="submit" style={{ width: '100%' }}>
              {busy ? "Signing in..." : "🔐 Sign In"}
            </button>

            {err && <div className="alert alert-error">{err}</div>}
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}