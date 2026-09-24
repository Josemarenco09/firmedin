import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./css/form.module.css";
import { useAuth } from "../../context/AuthContext";

function Form() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Credenciales inválidas");
        return;
      }

      const data = await res.json();
      login(data.token, data.user.name);
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <form className={styles.formLogin} onSubmit={handleSubmit}>
      <label className={styles.inputLogin}>
        Email
        <input
          className={styles.boxInputLogin}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </label>
      <label className={styles.inputLogin}>
        Password
        <input
          className={styles.boxInputLogin}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </label>
      <button className={styles.submitButton} type="submit">
        Submit
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

export default Form;
