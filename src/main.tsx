import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { supabase } from "./lib/supabase";
import { setAuth, setLoading } from "./features/auth/authSlice";
import App from "./App";

store.dispatch(setLoading(true));

supabase.auth.getSession().then(({ data }) => {
  store.dispatch(setAuth({ session: data.session ?? null }));
});

supabase.auth.onAuthStateChange((_event, session) => {
  store.dispatch(setAuth({ session }));
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);