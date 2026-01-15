import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
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

    setBusy(true);
    setErr(null);

    const { data, error } = await supabase
      .from("blogs")
      .insert([{ user_id: user.id, title, content }])
      .select("id")
      .single();

    setBusy(false);
    if (error) return setErr(error.message);

    nav(`/blogs/${data.id}`);
  };

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <h2>Create Blog</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          placeholder="Content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button disabled={busy} type="submit">{busy ? "Saving..." : "Create"}</button>
        {err && <div style={{ color: "crimson" }}>{err}</div>}
      </form>
    </div>
  );
}
