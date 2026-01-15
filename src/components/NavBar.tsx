import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function NavBar() {
  const { user, loading } = useAppSelector((s) => s.auth);

  return (
    <div style={{ padding: 16, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
      <Link to="/blogs">Blogs</Link>
      {!loading && user && <Link to="/blogs/new">Create</Link>}
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        {!loading && !user && (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        {!loading && user && (
          <>
            <span style={{ opacity: 0.7 }}>{user.email}</span>
            <Link to="/logout">Logout</Link>
          </>
        )}
      </div>
    </div>
  );
}
