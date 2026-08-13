import styles from "./css/form.module.css";

function form() {
  return (
    <form className={styles.formLogin}>
      <label className={styles.inputLogin}>
        User
        <input className={styles.boxInputLogin} type="text" />
      </label>
      <label className={styles.inputLogin}>
        Password
        <input className={styles.boxInputLogin} type="password" />
      </label>
      <button className={styles.submitButton} type="submit">
        Submit
      </button>
    </form>
  );
}

export default form;
