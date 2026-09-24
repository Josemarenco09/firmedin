import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login/index.tsx";
import HomePage from "./components/HomePage.tsx";
import Signatures from "./components/Signatures.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/firmas" element={<Signatures />} />
      </Route>

      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}

export default App;
