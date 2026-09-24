import { Navigate } from "react-router-dom";
import Form from "./form";
import styles from "./css/login.module.css";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/inicio" replace />;
  }

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
