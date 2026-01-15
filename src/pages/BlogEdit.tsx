import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, useParams } from "react-router-dom";
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

    setBusy(true);
    setErr(null);

    const { error } = await supabase
      .from("blogs")
      .update({ title, content })
      .eq("id", blog.id);

    setBusy(false);
    if (error) return setErr(error.message);

    nav(`/blogs/${blog.id}`);
  };

  const onDelete = async () => {
    if (!blog) return;
    setBusy(true);
    setErr(null);

    const { error } = await supabase.from("blogs").delete().eq("id", blog.id);

    setBusy(false);
    if (error) return setErr(error.message);

    nav("/blogs");
  };

  if (err) return <div style={{ padding: 16, color: "crimson" }}>{err}</div>;
  if (!blog) return <div style={{ padding: 16 }}>Loading...</div>;

  const isOwner = !!user && user.id === blog.user_id;
  if (!isOwner) return <div style={{ padding: 16 }}>Not allowed.</div>;

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <h2>Edit Blog</h2>
      <form onSubmit={onSave} style={{ display: "grid", gap: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
        <div style={{ display: "flex", gap: 12 }}>
          <button disabled={busy} type="submit">{busy ? "Saving..." : "Save"}</button>
          <button disabled={busy} type="button" onClick={onDelete} style={{ color: "crimson" }}>
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
