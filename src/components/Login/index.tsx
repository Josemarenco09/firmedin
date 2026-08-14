import Form from "./form";
import styles from "./css/login.module.css";
import type { Dispatch, SetStateAction } from "react";

function Login({ setUser }: { setUser: Dispatch<SetStateAction<string>> }) {
  return (
    <>
      <section className={styles.sectionLogin}>
        <h1> Login </h1>
        <Form setUser={setUser}></Form>
      </section>
    </>
  );
}

export default Login;
