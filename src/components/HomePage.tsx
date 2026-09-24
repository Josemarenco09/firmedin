import Header from "./Header";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <Header></Header>
      <p>{user}</p>
    </>
  );
}

export default HomePage;
