import { NavLink } from "react-router-dom";
import styles from "./header.module.css";
import { useAuth } from "../../context/AuthContext";

function NavPage() {
  const { logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <>
      <section className={styles.sectionNav}>
        <ul className={styles.nav}>
          <li>
            <NavLink to="/inicio" className={linkClass}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/firmas" className={linkClass}>
              Mis registros
            </NavLink>
          </li>
          <li>
            <button type="button" className={styles.logout} onClick={logout}>
              Log Out
            </button>
          </li>
        </ul>
      </section>
    </>
  );
}

export default NavPage;
