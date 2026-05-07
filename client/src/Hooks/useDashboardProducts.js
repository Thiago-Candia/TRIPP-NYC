import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createDashboardProduct,
  deleteDashboardProduct,
  deleteProductImage,
  listDashboardProducts,
  updateDashboardProduct,
  uploadProductImages,
} from "../api/dashboard";
import { compressImageFile } from "../Helpers/imageCompression";
import { useDebounce } from "./useDebounce";
import { EMPTY_VARIANT } from "../constants/dashboard";
import {
  buildProductPayload,
  filterDashboardProducts,
  normalizeProductForm,
} from "../utils/dashboardProductUtils";

export const useDashboardProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState(normalizeProductForm());
  const [files, setFiles] = useState([]);
  const debouncedSearch = useDebounce(search, 280);

  const productsQuery = useQuery({
    queryKey: ["dashboard-products", localStorage.getItem("active_store_id") || "global"],
    staleTime: 1000 * 60,
    queryFn: async () => {
      const data = await listDashboardProducts();
      return Array.isArray(data) ? data : data.results || [];
    },
  });

  const filteredProducts = useMemo(
    () => filterDashboardProducts(productsQuery.data || [], debouncedSearch),
    [productsQuery.data, debouncedSearch],
  );

  const resetForm = () => {
    setEditingId(null);
    setProductForm(normalizeProductForm());
    setFiles([]);
  };

  const saveMutation = useMutation({
    mutationFn: async ({ id, payload, imageFiles }) => {
      const saved = id
        ? await updateDashboardProduct(id, payload)
        : await createDashboardProduct(payload);

      if (imageFiles.length) {
        await uploadProductImages(saved.id, imageFiles);
      }

      return saved;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      resetForm();
      toast.success("Producto guardado correctamente");
    },
    onError: (error) => {
      console.error(error);
      const detail = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Error desconocido";
      toast.error(`Error al guardar: ${detail}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDashboardProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      toast.success("Producto eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el producto");
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: ({ productId, imageId }) => deleteProductImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      toast.success("Imagen eliminada");
    },
  });

  const prepareFiles = async (rawFiles) => {
    const imageFiles = rawFiles.filter((file) => file.type.startsWith("image/"));
    const compressed = await Promise.all(
      imageFiles.map((file) => compressImageFile(file)),
    );
    setFiles((currentFiles) => [...currentFiles, ...compressed]);
  };

  const moveFile = (from, to) => {
    setFiles((currentFiles) => {
      const nextFiles = [...currentFiles];
      const [moved] = nextFiles.splice(from, 1);
      nextFiles.splice(to, 0, moved);
      return nextFiles;
    });
  };

  const removeFile = (index) => {
    setFiles((currentFiles) => currentFiles.filter((_, fileIndex) => fileIndex !== index));
  };

  const setFieldValue = (field, value) => {
    setProductForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const setVariantValue = (index, field, value) => {
    setProductForm((currentForm) => {
      const variants = [...currentForm.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...currentForm, variants };
    });
  };

  const addVariant = () => {
    setProductForm((currentForm) => ({
      ...currentForm,
      variants: [...currentForm.variants, { ...EMPTY_VARIANT }],
    }));
  };

  const removeVariant = (index) => {
    setProductForm((currentForm) => ({
      ...currentForm,
      variants: currentForm.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setProductForm(normalizeProductForm(product));
    setFiles([]);
  };

  const submitProduct = () => {
    saveMutation.mutate({
      id: editingId,
      payload: buildProductPayload(productForm),
      imageFiles: files,
    });
  };

  return {
    products: filteredProducts,
    totalProducts: productsQuery.data?.length || 0,
    search,
    setSearch,
    editingId,
    productForm,
    files,
    isLoading: productsQuery.isLoading,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    setFieldValue,
    setVariantValue,
    addVariant,
    removeVariant,
    editProduct,
    resetForm,
    submitProduct,
    deleteProduct: deleteMutation.mutate,
    deleteProductImage: deleteImageMutation.mutate,
    prepareFiles,
    moveFile,
    removeFile,
  };
};
