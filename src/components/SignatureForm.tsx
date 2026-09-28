import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { CATEGORIES, CATEGORY_LABELS } from "../types";
import type { Category, Signature } from "../types";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

function SignatureForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const api = useApi();
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<Category>("OTRO");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    async function load() {
      try {
        const res = await api(`/signatures/${id}`);
        if (!res.ok) throw new Error();
        const s: Signature = await res.json();
        if (ignore) return;
        setLabel(s.label);
        setCategory(s.category);
        setNotes(s.notes ?? "");
        setCurrentImage(s.imageData);
      } catch {
        if (!ignore) setLoadFailed(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id, api]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setError(null);

    if (selected && !ALLOWED_TYPES.includes(selected.type)) {
      setError("La imagen debe ser PNG, JPG o WEBP");
      e.target.value = "";
      setFile(null);
      return;
    }
    if (selected && selected.size > MAX_SIZE) {
      setError("La imagen supera 5 MB");
      e.target.value = "";
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!label.trim()) {
      setError("La etiqueta es obligatoria");
      return;
    }
    if (!isEdit && !file) {
      setError("Selecciona una imagen");
      return;
    }

    setSaving(true);
    try {
      let res: Response;

      if (isEdit) {
        res = await api(`/signatures/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: label.trim(), category, notes: notes.trim() }),
        });
      } else {
        const data = new FormData();
        data.append("label", label.trim());
        data.append("category", category);
        if (notes.trim()) data.append("notes", notes.trim());
        data.append("image", file!);
        res = await api("/signatures", { method: "POST", body: data });
      }

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "No se pudo guardar la firma");
        return;
      }

      navigate("/firmas");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted">Cargando...</p>;

  if (loadFailed) {
    return (
      <>
        <div className="alert alert-danger">No se encontró la firma.</div>
        <Link to="/firmas" className="btn btn-outline-secondary">
          Volver a mis registros
        </Link>
      </>
    );
  }

  return (
    <>
      <h2>{isEdit ? "Editar firma" : "Nueva firma"}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "520px" }}>
        <div className="mb-3">
          <label htmlFor="label" className="form-label">
            Etiqueta
          </label>
          <input
            id="label"
            className="form-control"
            value={label}
            maxLength={80}
            placeholder="Ej: Firma para contratos"
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Categoría
          </label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="notes" className="form-label">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            className="form-control"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {isEdit ? (
          currentImage && (
            <div className="mb-3">
              <div className="form-label">Imagen</div>
              <img src={currentImage} alt={label} className="img-thumbnail d-block" style={{ maxHeight: "160px" }} />
              <div className="form-text">La imagen no se puede cambiar; crea una firma nueva si necesitas otra.</div>
            </div>
          )
        ) : (
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Imagen (PNG, JPG o WEBP, máximo 5 MB)
            </label>
            <input
              id="image"
              type="file"
              className="form-control"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFile}
            />
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="img-thumbnail d-block mt-3"
                style={{ maxHeight: "160px" }}
              />
            )}
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <Link to="/firmas" className="btn btn-outline-secondary ms-2">
          Cancelar
        </Link>
      </form>
    </>
  );
}

export default SignatureForm;
