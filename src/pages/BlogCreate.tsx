import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function BlogCreate() {
  const nav = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      return setErr("Title is required");
    }
    if (!content.trim()) {
      return setErr("Content is required");
    }

    setBusy(true);
    setErr(null);

    const { data, error } = await supabase
      .from("blogs")
      .insert([{ user_id: user.id, title: title.trim(), content: content.trim() }])
      .select("id")
      .single();

    setBusy(false);
    if (error) return setErr(error.message);

    nav(`/blogs/${data.id}`);
  };

  return (
    <div className="page">
      <div className="container container-md">
        <Link to="/blogs" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ← Cancel
        </Link>

        <div className="card">
          <h2>✨ Create New Post</h2>
          
          <form onSubmit={onSubmit} className="form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                type="text"
                placeholder="Enter your post title..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                placeholder="Write your story..."
                rows={15}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button disabled={busy} type="submit">
                {busy ? "Publishing..." : "📝 Publish Post"}
              </button>
              <Link to="/blogs">
                <button type="button" className="btn btn-secondary">
                  Cancel
                </button>
              </Link>
            </div>

            {err && <div className="alert alert-error">{err}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}