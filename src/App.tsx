import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login/index.tsx";
import Layout from "./components/Layout.tsx";
import HomePage from "./components/HomePage.tsx";
import Signatures from "./components/Signatures.tsx";
import SignatureForm from "./components/SignatureForm.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/firmas" element={<Signatures />} />
          <Route path="/firmas/nueva" element={<SignatureForm />} />
          <Route path="/firmas/:id/editar" element={<SignatureForm />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}

export default App;
