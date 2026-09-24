import Form from "./form";
import styles from "./css/login.module.css";

function Login({ onLogin }: { onLogin: (token: string, userName: string) => void }) {
  return (
    <>
      <section className={styles.sectionLogin}>
        <h1> Login </h1>
        <Form onLogin={onLogin}></Form>
      </section>
    </>
  );
}

export default Login;
