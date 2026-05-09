import { PRODUCT_SIZE_OPTIONS } from "../../constants/dashboard";

const VariantEditor = ({
  variants,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
}) => {
  return (
    <section className="dashboard-form-section">
      <div className="dashboard-form-section__header">
        <h3 className="dashboard-card__subtitle">Variantes</h3>
        <button
          className="dashboard-btn dashboard-btn--secondary dashboard-btn--compact"
          type="button"
          onClick={onAddVariant}
        >
          Agregar variante
        </button>
      </div>

      {variants.map((variant, index) => (
        <div className="variant-row" key={index}>
          <select
            className="dashboard-field"
            value={variant.size}
            onChange={(event) => onVariantChange(index, "size", event.target.value)}
          >
            {PRODUCT_SIZE_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            className="dashboard-field"
            value={variant.color}
            placeholder="Color"
            onChange={(event) => onVariantChange(index, "color", event.target.value)}
          />
          <input
            className="dashboard-field"
            value={variant.sku || ""}
            placeholder="SKU variante"
            onChange={(event) => onVariantChange(index, "sku", event.target.value)}
          />
          <input
            className="dashboard-field"
            type="number"
            value={variant.stock}
            placeholder="Stock"
            onChange={(event) => onVariantChange(index, "stock", event.target.value)}
          />
          <button
            className="dashboard-btn dashboard-btn--icon"
            type="button"
            onClick={() => onRemoveVariant(index)}
            disabled={variants.length === 1}
          >
            x
          </button>
        </div>
      ))}
    </section>
  );
};

export default VariantEditor;
