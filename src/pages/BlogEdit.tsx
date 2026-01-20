import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

type Blog = {
  id: string;
  user_id: string;
  title: string;
  content: string;
};

export default function BlogEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      setErr(null);
      const { data, error } = await supabase.from("blogs").select("id,user_id,title,content").eq("id", id).single();
      if (error) return setErr(error.message);

      const b = data as Blog;
      setBlog(b);
      setTitle(b.title);
      setContent(b.content);
    })();
  }, [id]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !blog) return;

    if (!title.trim()) {
      return setErr("Title is required");
    }
    if (!content.trim()) {
      return setErr("Content is required");
    }

    setBusy(true);
    setErr(null);

    const { error } = await supabase
      .from("blogs")
      .update({ title: title.trim(), content: content.trim() })
      .eq("id", blog.id);

    setBusy(false);
    if (error) return setErr(error.message);

    nav(`/blogs/${blog.id}`);
  };

  const onDelete = async () => {
    if (!blog) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmed) return;

    setBusy(true);
    setErr(null);

    const { error } = await supabase.from("blogs").delete().eq("id", blog.id);

    setBusy(false);
    if (error) return setErr(error.message);

    nav("/blogs");
  };

  if (err && !blog) return (
    <div className="page">
      <div className="container container-sm">
        <div className="alert alert-error">{err}</div>
        <Link to="/blogs">← Back to blogs</Link>
      </div>
    </div>
  );

  if (!blog) return (
    <div className="page">
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    </div>
  );

  const isOwner = !!user && user.id === blog.user_id;
  
  if (!isOwner) return (
    <div className="page">
      <div className="container container-sm">
        <div className="alert alert-error">You don't have permission to edit this post.</div>
        <Link to={`/blogs/${blog.id}`}>← Back to post</Link>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="container container-md">
        <Link to={`/blogs/${blog.id}`} style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ← Cancel
        </Link>

        <div className="card">
          <h2>✏️ Edit Post</h2>
          
          <form onSubmit={onSave} className="form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                type="text"
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea 
                rows={15} 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
              />
            </div>

            <div className="form-actions">
              <button disabled={busy} type="submit">
                {busy ? "Saving..." : "💾 Save Changes"}
              </button>
              <button 
                disabled={busy} 
                type="button" 
                onClick={onDelete} 
                className="btn btn-danger"
              >
                🗑️ Delete Post
              </button>
            </div>

            {err && <div className="alert alert-error">{err}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}