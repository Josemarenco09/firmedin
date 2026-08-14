import Login from "./components/Login/index.tsx";
import HomePage from "./components/HomePage.tsx";
import { useState } from "react";

function App() {

  const [user, setUser] = useState("")

  return (
    <>
      <Login setUser={setUser}></Login>
      <HomePage user={user}></HomePage>
    </>
  );
}

export default App;
