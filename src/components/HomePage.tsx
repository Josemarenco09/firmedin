import Header from "./Header";

function HomePage({ user, onLogout }: { user: string; onLogout: () => void }) {
  return (
    <>
      <Header onLogout={onLogout}></Header>
      <p>{user}</p>
    </>
  );
}

export default HomePage;
