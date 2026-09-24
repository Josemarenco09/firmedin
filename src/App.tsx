import Login from "./components/Login/index.tsx";
import HomePage from "./components/HomePage.tsx";
import { useState } from "react";

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<string>(() => localStorage.getItem("userName") ?? "");

  const handleLogin = (newToken: string, userName: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userName", userName);
    setToken(newToken);
    setUser(userName);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setUser("");
  };

  return token ? (
    <HomePage user={user} onLogout={handleLogout}></HomePage>
  ) : (
    <Login onLogin={handleLogin}></Login>
  );
}

export default App;
