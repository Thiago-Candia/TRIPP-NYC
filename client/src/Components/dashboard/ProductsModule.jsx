import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDashboardProduct,
  deleteDashboardProduct,
  deleteProductImage,
  listDashboardProducts,
  updateDashboardProduct,
  uploadProductImages,
} from "../../api/dashboard";
import { useDebounce } from "../../Hooks/useDebounce";
import { compressImageFile } from "../../Helpers/imageCompression";

const emptyVariant = { size: "", color: "", color_code: "", sku: "", price_adjustment: 0, stock: 0, is_active: true };
const emptyForm = {
  name: "",
  description: "",
  price: "",
  compare_at_price: "",
  sku: "",
  stock: 0,
  is_active: true,
  is_featured: false,
  variants: [emptyVariant],
};

const ProductsModule = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const debouncedSearch = useDebounce(search, 280);

  const productsQuery = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: async () => {
      const data = await listDashboardProducts();
      return Array.isArray(data) ? data : data.results || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, payload, imageFiles }) => {
      const saved = id ? await updateDashboardProduct(id, payload) : await createDashboardProduct(payload);
      if (imageFiles.length) await uploadProductImages(saved.id, imageFiles);
      return saved;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      setEditingId(null);
      setProductForm(emptyForm);
      setFiles([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDashboardProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard-products"] }),
  });

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return productsQuery.data || [];
    return (productsQuery.data || []).filter((item) =>
      `${item.name} ${item.sku || ""}`.toLowerCase().includes(term)
    );
  }, [productsQuery.data, debouncedSearch]);

  const setVariantValue = (index, field, value) => {
    setProductForm((prev) => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  const prepareFiles = async (rawFiles) => {
    const compressed = await Promise.all(rawFiles.map((file) => compressImageFile(file)));
    setFiles(compressed);
  };

  const moveFile = (from, to) => {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const payload = () => ({
    ...productForm,
    price: Number(productForm.price || 0),
    compare_at_price: productForm.compare_at_price ? Number(productForm.compare_at_price) : null,
    stock: Number(productForm.stock || 0),
    variants: productForm.variants.filter((v) => v.sku).map((v) => ({
      ...v,
      price_adjustment: Number(v.price_adjustment || 0),
      stock: Number(v.stock || 0),
    })),
  });

  return (
    <div className="dashboard-grid">
      <form
        className="dashboard-card"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate({ id: editingId, payload: payload(), imageFiles: files });
        }}
      >
        <h2 className="dashboard-card__title">{editingId ? "Editar producto" : "Nuevo producto"}</h2>
        <input className="dashboard-field" value={productForm.name} placeholder="Nombre" onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} required />
        <textarea className="dashboard-field dashboard-field--textarea" value={productForm.description} placeholder="Descripción" onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} />
        <div className="row">
          <input className="dashboard-field" type="number" step="0.01" value={productForm.price} placeholder="Precio" onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} required />
          <input className="dashboard-field" type="number" step="0.01" value={productForm.compare_at_price} placeholder="Precio comparado" onChange={(e) => setProductForm((p) => ({ ...p, compare_at_price: e.target.value }))} />
        </div>
        <div className="row">
          <input className="dashboard-field" value={productForm.sku} placeholder="SKU" onChange={(e) => setProductForm((p) => ({ ...p, sku: e.target.value }))} />
          <input className="dashboard-field" type="number" value={productForm.stock} placeholder="Stock" onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} />
        </div>
        <label className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
          e.preventDefault();
          prepareFiles(Array.from(e.dataTransfer.files));
        }}>
          Arrastra imágenes o selecciona
          <input className="dropzone__input" type="file" multiple accept="image/*" onChange={(e) => prepareFiles(Array.from(e.target.files || []))} />
        </label>
        <div className="preview-grid">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", String(index))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const from = Number(e.dataTransfer.getData("text/plain"));
                moveFile(from, index);
              }}
            >
              <img src={URL.createObjectURL(file)} alt={file.name} loading="lazy" />
            </div>
          ))}
        </div>

        <h3 className="dashboard-card__subtitle">Variantes</h3>
        {productForm.variants.map((variant, index) => (
          <div className="variant-row" key={`${variant.sku}-${index}`}>
            <input className="dashboard-field" value={variant.size} placeholder="Talle" onChange={(e) => setVariantValue(index, "size", e.target.value)} />
            <input className="dashboard-field" value={variant.color} placeholder="Color" onChange={(e) => setVariantValue(index, "color", e.target.value)} />
            <input className="dashboard-field" value={variant.sku} placeholder="SKU variante" onChange={(e) => setVariantValue(index, "sku", e.target.value)} />
            <button className="dashboard-btn dashboard-btn--icon" type="button" onClick={() => setProductForm((p) => ({ ...p, variants: p.variants.filter((_, i) => i !== index) }))}>x</button>
          </div>
        ))}
        <button className="dashboard-btn dashboard-btn--secondary" type="button" onClick={() => setProductForm((p) => ({ ...p, variants: [...p.variants, { ...emptyVariant }] }))}>
          Agregar variante
        </button>
        <button className="dashboard-btn dashboard-btn--primary" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Guardando..." : "Guardar"}</button>
      </form>

      <article className="dashboard-card">
        <div className="table-header">
          <h2 className="dashboard-card__title">Productos</h2>
          <input className="dashboard-field table-header__search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar" />
        </div>
        <div className="table-wrap">
          <table className="dashboard-table">
            <thead className="dashboard-table__head">
              <tr className="dashboard-table__row"><th className="dashboard-table__th">Producto</th><th className="dashboard-table__th">Precio</th><th className="dashboard-table__th">Stock</th><th className="dashboard-table__th">Acciones</th></tr>
            </thead>
            <tbody className="dashboard-table__body">
              {filtered.map((product) => (
                <tr className="dashboard-table__row" key={product.id}>
                  <td className="dashboard-table__td">{product.name}</td>
                  <td className="dashboard-table__td">${product.price}</td>
                  <td className="dashboard-table__td">{product.stock}</td>
                  <td className="dashboard-table__td">
                    <button className="dashboard-btn dashboard-btn--table" onClick={() => {
                      setEditingId(product.id);
                      setProductForm({
                        ...emptyForm,
                        ...product,
                        variants: product.variants?.length ? product.variants : [emptyVariant],
                      });
                    }}>Editar</button>
                    <button className="dashboard-btn dashboard-btn--table" onClick={() => deleteMutation.mutate(product.id)}>Eliminar</button>
                    {product.images?.[0] && (
                      <button className="dashboard-btn dashboard-btn--table"
                        onClick={() => deleteProductImage(product.id, product.images[0].id).then(() => {
                          queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
                        })}
                      >
                        Borrar imagen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
};

export default ProductsModule;
