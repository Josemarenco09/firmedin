import { useEffect, useState } from "react";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../lib/api";
import type { Signature } from "../types";

const CATEGORIES = ["TRABAJO", "FAMILIA", "PERSONAL", "OTRO"];

function Signatures() {
  const { token, logout } = useAuth();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const query = category ? `?category=${category}` : "";
        const res = await fetch(`${API_URL}/signatures${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) return logout();
        if (!res.ok) throw new Error();
        const data: Signature[] = await res.json();
        if (!ignore) setSignatures(data);
      } catch {
        if (!ignore) setError("No se pudieron cargar las firmas");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [category, token, logout]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Borrar esta firma?")) return;

    try {
      const res = await fetch(`${API_URL}/signatures/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return logout();
      if (!res.ok) throw new Error();
      setSignatures((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("No se pudo borrar la firma");
    }
  };

  return (
    <>
      <Header></Header>
      <h2>Mis registros</h2>

      <label>
        Categoría{" "}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {error && <p>{error}</p>}
      {loading && <p>Cargando...</p>}
      {!loading && !error && signatures.length === 0 && <p>Aún no tienes firmas</p>}

      {signatures.length > 0 && (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Firma</th>
              <th>Etiqueta</th>
              <th>Categoría</th>
              <th>Notas</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {signatures.map((s) => (
              <tr key={s.id}>
                <td>
                  <img src={s.imageData} alt={s.label} style={{ width: "80px" }} />
                </td>
                <td>{s.label}</td>
                <td>{s.category}</td>
                <td>{s.notes}</td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Signatures;
