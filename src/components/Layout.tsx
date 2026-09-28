import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
  return (
    <>
      <Header></Header>
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
