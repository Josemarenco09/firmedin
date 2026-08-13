import { useState } from "react";
import styles from "./css/form.module.css";

function form() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (user === "" || password === "") {
      setError(true);
      return;
    }
  };

  return (
    <form className={styles.formLogin} onSubmit={handleSubmit}>
      <label className={styles.inputLogin}>
        User
        <input
          className={styles.boxInputLogin}
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
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

      {error ? <p className={styles.error}> Todos los campos son obligatorios </p> : ""}
    </form>
  );
}

export default form;
