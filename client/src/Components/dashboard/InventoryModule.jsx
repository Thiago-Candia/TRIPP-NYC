import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listDashboardProducts, updateDashboardProduct } from "../../api/dashboard";
import { useDebounce } from "../../Hooks/useDebounce";

const InventoryModule = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 250);

  const query = useQuery({
    queryKey: ["inventory-products"],
    queryFn: async () => {
      const data = await listDashboardProducts();
      return Array.isArray(data) ? data : data.results || [];
    },
  });

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateDashboardProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory-products"] }),
  });

  const rows = useMemo(() => {
    const term = debounced.toLowerCase().trim();
    if (!term) return query.data || [];
    return (query.data || []).filter((item) => item.name.toLowerCase().includes(term));
  }, [query.data, debounced]);

  return (
    <article className="dashboard-card">
      <h2 className="dashboard-card__title">Inventory</h2>
      <input className="dashboard-field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre" />
      <div className="table-wrap">
        <table className="dashboard-table">
          <thead className="dashboard-table__head"><tr className="dashboard-table__row"><th className="dashboard-table__th">Producto</th><th className="dashboard-table__th">Stock</th><th className="dashboard-table__th">Activo</th><th className="dashboard-table__th">Guardar</th></tr></thead>
          <tbody className="dashboard-table__body">
            {rows.map((product) => (
              <tr className="dashboard-table__row" key={product.id}>
                <td className="dashboard-table__td">{product.name}</td>
                <td className="dashboard-table__td">
                  <input
                    className="dashboard-field"
                    type="number"
                    defaultValue={product.stock}
                    onBlur={(e) => mutation.mutate({ id: product.id, payload: { ...product, stock: Number(e.target.value) } })}
                  />
                </td>
                <td className="dashboard-table__td">{product.is_active ? "Si" : "No"}</td>
                <td className="dashboard-table__td">Auto-save on blur</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default InventoryModule;
