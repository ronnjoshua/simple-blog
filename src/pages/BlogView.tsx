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

  if (err) return (
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
        <div className="loading">Loading post...</div>
      </div>
    </div>
  );

  const isOwner = !!user && user.id === blog.user_id;

  return (
    <div className="page">
      <div className="container container-md">
        <Link to="/blogs" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to all posts
        </Link>
        
        <article>
          <div className="blog-header">
            <h1>{blog.title}</h1>
            <div className="blog-meta">
              <div>
                📅 Published {new Date(blog.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {blog.created_at !== blog.updated_at && (
                <div className="text-muted">
                  Last updated {new Date(blog.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>

            {isOwner && (
              <div className="blog-actions">
                <Link to={`/blogs/${blog.id}/edit`}>
                  <button className="btn">✏️ Edit Post</button>
                </Link>
              </div>
            )}
          </div>

          <div className="blog-content">
            {blog.content}
          </div>
        </article>
      </div>
    </div>
  );
}