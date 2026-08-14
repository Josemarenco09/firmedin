import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import styles from "./css/form.module.css";

function Form({ setUser }: { setUser: Dispatch<SetStateAction<string>> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setError(true);
      return;
    }

    setUser(username);
  };

  return (
    <form className={styles.formLogin} onSubmit={handleSubmit}>
      <label className={styles.inputLogin}>
        User
        <input
          className={styles.boxInputLogin}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

export default Form;
