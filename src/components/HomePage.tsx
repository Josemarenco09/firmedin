import Header from "./Header";

function HomePage({ user }: { user: string }) {
  return (
    <>
      <Header></Header>
      <p>{user}</p>
    </>
  );
}

export default HomePage;
