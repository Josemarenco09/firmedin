import styles from "./css/form.module.css";

function form() {
  return (
    <form className={styles.formLogin}>
      <label className={styles.inputLogin}>
        user
        <input className={styles.boxInputLogin} type="text" />
      </label>
      <label className={styles.inputLogin}>
        password
        <input className={styles.boxInputLogin} type="password" />
      </label>
      <button type="submit"></button>
    </form>
  );
}

export default form;
