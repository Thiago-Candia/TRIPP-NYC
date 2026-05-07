import ImageDropzone from "./ImageDropzone";
import VariantEditor from "./VariantEditor";

const ProductForm = ({
  editingId,
  form,
  files,
  isSaving,
  onFieldChange,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
  onFilesSelected,
  onMoveFile,
  onRemoveFile,
  onCancel,
  onSubmit,
}) => {
  return (
    <form
      className="dashboard-card"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="dashboard-card__heading">
        <h2 className="dashboard-card__title">
          {editingId ? "Editar producto" : "Nuevo producto"}
        </h2>
        {editingId && (
          <button
            className="dashboard-btn dashboard-btn--secondary dashboard-btn--compact"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>

      <input
        className="dashboard-field"
        value={form.name}
        placeholder="Nombre"
        onChange={(event) => onFieldChange("name", event.target.value)}
        required
      />
      <textarea
        className="dashboard-field dashboard-field--textarea"
        value={form.description}
        placeholder="Descripcion"
        onChange={(event) => onFieldChange("description", event.target.value)}
      />
      <div className="row">
        <input
          className="dashboard-field"
          type="number"
          step="0.01"
          value={form.price}
          placeholder="Precio"
          onChange={(event) => onFieldChange("price", event.target.value)}
          required
        />
        <input
          className="dashboard-field"
          type="number"
          step="0.01"
          value={form.compare_at_price || ""}
          placeholder="Precio comparado"
          onChange={(event) => onFieldChange("compare_at_price", event.target.value)}
        />
      </div>
      <div className="row">
        <input
          className="dashboard-field"
          value={form.sku || ""}
          placeholder="SKU opcional"
          onChange={(event) => onFieldChange("sku", event.target.value)}
        />
        <input
          className="dashboard-field"
          type="number"
          value={form.stock}
          placeholder="Stock"
          onChange={(event) => onFieldChange("stock", event.target.value)}
        />
      </div>
      <div className="dashboard-switches">
        <label>
          <input
            type="checkbox"
            checked={Boolean(form.is_active)}
            onChange={(event) => onFieldChange("is_active", event.target.checked)}
          />
          Activo
        </label>
        <label>
          <input
            type="checkbox"
            checked={Boolean(form.is_featured)}
            onChange={(event) => onFieldChange("is_featured", event.target.checked)}
          />
          Featured
        </label>
      </div>

      <ImageDropzone
        files={files}
        onFilesSelected={onFilesSelected}
        onMoveFile={onMoveFile}
        onRemoveFile={onRemoveFile}
      />

      <VariantEditor
        variants={form.variants}
        onVariantChange={onVariantChange}
        onAddVariant={onAddVariant}
        onRemoveVariant={onRemoveVariant}
      />

      <button
        className="dashboard-btn dashboard-btn--primary"
        type="submit"
        disabled={isSaving}
      >
        {isSaving ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
};

export default ProductForm;
