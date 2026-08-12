import Form from "./form";
import styles from "./css/login.module.css";

function Login() {
  return (
    <>
      <section className={styles.sectionLogin}>
        <h1> Login </h1>
        <Form></Form>
      </section>
    </>
  );
}

export default Login;
