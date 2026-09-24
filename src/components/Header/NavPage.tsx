import { NavLink } from "react-router-dom";
import styles from "./header.module.css";
import { useAuth } from "../../context/AuthContext";

function NavPage() {
  const { logout } = useAuth();

  return (
    <>
      <section className={styles.sectionNav}>
        <ul className={styles.nav}>
          <li>
            <NavLink to="/inicio">Inicio</NavLink>
          </li>
          <li>
            <NavLink to="/firmas">Mis registros</NavLink>
          </li>
          <li>
            <a onClick={logout}>Log Out</a>
          </li>
        </ul>
      </section>
    </>
  );
}

export default NavPage;
