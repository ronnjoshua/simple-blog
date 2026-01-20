import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function NavBar() {
  const { user, loading } = useAppSelector((s) => s.auth);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/blogs" className="navbar-brand">
          📝 My Blog
        </Link>
        <div className="navbar-links">
          <Link to="/blogs">Home</Link>
          {!loading && user && <Link to="/blogs/new">✨ Create Post</Link>}
        </div>
        <div className="navbar-end">
          {!loading && !user && (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">
                <button className="btn">Login</button>
              </Link>
            </>
          )}
          {!loading && user && (
            <>
              <span className="user-email">{user.email}</span>
              <Link to="/logout">
                <button className="btn btn-secondary">Logout</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}