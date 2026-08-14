import styles from "./header.module.css";

function NavPage() {
  return (
    <>
      <section className={styles.sectionNav}>
        <ul className={styles.nav}>
          <li>
            <a>Inicio</a>
          </li>
          <li>
            <a>Mis registros</a>
          </li>
          <li>
            <a>Log Out</a>
          </li>
        </ul>
      </section>
    </>
  );
}

export default NavPage;
