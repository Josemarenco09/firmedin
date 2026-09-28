import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { CATEGORIES, CATEGORY_BADGE, CATEGORY_LABELS } from "../types";
import type { Signature } from "../types";

const downloadUrl = (url: string) => url.replace("/upload/", "/upload/fl_attachment/");

function Signatures() {
  const api = useApi();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const query = category ? `?category=${category}` : "";
        const res = await api(`/signatures${query}`);
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
  }, [category, api]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Borrar esta firma?")) return;

    try {
      const res = await api(`/signatures/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSignatures((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("No se pudo borrar la firma");
    }
  };

  const term = search.trim().toLowerCase();
  const visible = signatures.filter((s) =>
    `${s.label} ${s.notes ?? ""}`.toLowerCase().includes(term),
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Mis registros</h2>
        <Link to="/firmas/nueva" className="btn btn-primary">
          Nueva firma
        </Link>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por etiqueta o notas"
            aria-label="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-3">
          <select
            className="form-select"
            aria-label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-muted">Cargando...</p>}

      {!loading && !error && signatures.length === 0 && (
        <p className="text-muted">
          Aún no tienes firmas{category ? " en esta categoría" : ""}.{" "}
          <Link to="/firmas/nueva">Agrega la primera</Link>
        </p>
      )}
      {!loading && signatures.length > 0 && visible.length === 0 && (
        <p className="text-muted">Ninguna firma coincide con tu búsqueda.</p>
      )}

      {visible.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Firma</th>
                <th>Etiqueta</th>
                <th>Categoría</th>
                <th className="d-none d-md-table-cell">Notas</th>
                <th className="d-none d-md-table-cell">Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.id}>
                  <td>
                    <a href={s.imageData} target="_blank" rel="noopener noreferrer" title="Ver imagen">
                      <img
                        src={s.imageData}
                        alt={s.label}
                        className="img-thumbnail"
                        style={{ width: "80px" }}
                      />
                    </a>
                  </td>
                  <td>
                    <div>{s.label}</div>
                    {s.notes && <div className="d-md-none small text-muted">{s.notes}</div>}
                  </td>
                  <td>
                    <span className={`badge ${CATEGORY_BADGE[s.category]}`}>
                      {CATEGORY_LABELS[s.category]}
                    </span>
                  </td>
                  <td className="d-none d-md-table-cell">{s.notes}</td>
                  <td className="d-none d-md-table-cell">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex flex-column flex-md-row gap-1">
                      <a className="btn btn-sm btn-outline-primary" href={downloadUrl(s.imageData)} download>
                        Descargar
                      </a>
                      <Link className="btn btn-sm btn-outline-secondary" to={`/firmas/${s.id}/editar`}>
                        Editar
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}>
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Signatures;
