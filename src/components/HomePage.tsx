import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { CATEGORIES, CATEGORY_LABELS } from "../types";
import type { Signature } from "../types";

function HomePage() {
  const { user } = useAuth();
  const api = useApi();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await api("/signatures");
        if (!res.ok) throw new Error();
        const data: Signature[] = await res.json();
        if (!ignore) setSignatures(data);
      } catch {
        if (!ignore) setError("No se pudieron cargar tus firmas");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [api]);

  return (
    <>
      <h2>Hola, {user}</h2>
      <p className="text-muted">Tus firmas, siempre a la mano.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-6 col-md">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="fs-2 fw-bold">{loading ? "…" : signatures.length}</div>
              <div className="text-muted">Total</div>
            </div>
          </div>
        </div>
        {CATEGORIES.map((c) => (
          <div className="col-6 col-md" key={c}>
            <div className="card text-center h-100">
              <div className="card-body">
                <div className="fs-2 fw-bold">
                  {loading ? "…" : signatures.filter((s) => s.category === c).length}
                </div>
                <div className="text-muted">{CATEGORY_LABELS[c]}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/firmas/nueva" className="btn btn-primary me-2">
        Agregar firma
      </Link>
      <Link to="/firmas" className="btn btn-outline-primary">
        Ver mis registros
      </Link>
    </>
  );
}

export default HomePage;
