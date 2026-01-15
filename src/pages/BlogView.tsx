import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

type Blog = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export default function BlogView() {
  const { id } = useParams();
  const { user } = useAppSelector((s) => s.auth);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setErr(null);
      const { data, error } = await supabase.from("blogs").select("*").eq("id", id).single();
      if (error) return setErr(error.message);
      setBlog(data as Blog);
    })();
  }, [id]);

  if (err) return <div style={{ padding: 16, color: "crimson" }}>{err}</div>;
  if (!blog) return <div style={{ padding: 16 }}>Loading...</div>;

  const isOwner = !!user && user.id === blog.user_id;

  return (
    <div style={{ padding: 16 }}>
      <h2>{blog.title}</h2>
      <div style={{ opacity: 0.7 }}>
        Created: {new Date(blog.created_at).toLocaleString()} | Updated: {new Date(blog.updated_at).toLocaleString()}
      </div>

      {isOwner && (
        <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
          <Link to={`/blogs/${blog.id}/edit`}>Edit</Link>
        </div>
      )}

      <div style={{ marginTop: 16, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {blog.content}
      </div>
    </div>
  );
}
