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
    <div className="page">
      <div className="container container-md">
        <h1>✍️ Blog Posts</h1>

        {!user && (
          <div className="alert alert-info">
            You're browsing as a guest. <Link to="/login">Login</Link> to create and edit posts.
          </div>
        )}

        {busy && <div className="loading">Loading posts...</div>}
        {err && <div className="alert alert-error">{err}</div>}

        <div className="blog-list">
          {items.map((b) => (
            <article key={b.id} className="blog-item">
              <Link to={`/blogs/${b.id}`} className="blog-item-title">
                {b.title}
              </Link>
              <time className="blog-item-date">
                {new Date(b.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <div className="blog-item-excerpt">
                {b.content.length > 200 ? b.content.slice(0, 200) + "…" : b.content}
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && !busy && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No posts yet</h3>
            <p className="text-muted">
              {user ? (
                <>Be the first to <Link to="/blogs/new">create a post</Link>!</>
              ) : (
                <>Login to create the first post.</>
              )}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ← Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}