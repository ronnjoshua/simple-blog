import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

type Blog = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export default function BlogsList() {
  const { user } = useAppSelector((s) => s.auth);
  const [items, setItems] = useState<Blog[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  useEffect(() => {
    (async () => {
      setBusy(true);
      setErr(null);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await supabase
        .from("blogs")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      setBusy(false);
      if (error) return setErr(error.message);

      setItems((data ?? []) as Blog[]);
      setTotal(count ?? 0);
    })();
  }, [page]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Blogs</h2>

      {!user && (
        <div style={{ marginBottom: 12, padding: 12, border: "1px solid #ddd" }}>
          You’re browsing as guest. <Link to="/login">Login</Link> to create/edit.
        </div>
      )}

      {busy && <div>Loading...</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((b) => (
          <div key={b.id} style={{ padding: 12, border: "1px solid #ddd" }}>
            <Link to={`/blogs/${b.id}`} style={{ fontSize: 18, fontWeight: 600 }}>
              {b.title}
            </Link>
            <div style={{ opacity: 0.7, marginTop: 6 }}>
              {new Date(b.created_at).toLocaleString()}
            </div>
            <div style={{ marginTop: 8, opacity: 0.9 }}>
              {b.content.length > 160 ? b.content.slice(0, 160) + "…" : b.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
