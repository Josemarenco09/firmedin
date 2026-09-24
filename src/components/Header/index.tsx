import Image from "./Image";
import NavPage from "./NavPage";
import styles from "./header.module.css";

function Index({ onLogout }: { onLogout: () => void }) {
  return (
    <>
      <div className={styles.header}>
        <Image></Image>
        <NavPage onLogout={onLogout}></NavPage>
      </div>
    </>
  );
}
export default Index;
