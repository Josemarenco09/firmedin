import Image from "./Image";
import NavPage from "./NavPage";
import styles from "./header.module.css";

function Index() {
  return (
    <>
      <div className={styles.header}>
        <Image></Image>
        <NavPage></NavPage>
      </div>
    </>
  );
}
export default Index;
