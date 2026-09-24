import styles from "./header.module.css";

function NavPage({ onLogout }: { onLogout: () => void }) {
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
            <a onClick={onLogout}>Log Out</a>
          </li>
        </ul>
      </section>
    </>
  );
}

export default NavPage;
