import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      nav("/login", { replace: true });
    })();
  }, [nav]);

  return <div style={{ padding: 16 }}>Logging out...</div>;
}
