import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import { useDashboardProducts } from "../../Hooks/useDashboardProducts";

const ProductsModule = () => {
  const dashboardProducts = useDashboardProducts();

  return (
    <div className="dashboard-grid">
      <ProductForm
        editingId={dashboardProducts.editingId}
        form={dashboardProducts.productForm}
        files={dashboardProducts.files}
        isSaving={dashboardProducts.isSaving}
        onFieldChange={dashboardProducts.setFieldValue}
        onVariantChange={dashboardProducts.setVariantValue}
        onAddVariant={dashboardProducts.addVariant}
        onRemoveVariant={dashboardProducts.removeVariant}
        onFilesSelected={dashboardProducts.prepareFiles}
        onMoveFile={dashboardProducts.moveFile}
        onRemoveFile={dashboardProducts.removeFile}
        onCancel={dashboardProducts.resetForm}
        onSubmit={dashboardProducts.submitProduct}
      />

      <ProductTable
        products={dashboardProducts.products}
        totalProducts={dashboardProducts.totalProducts}
        search={dashboardProducts.search}
        onSearchChange={dashboardProducts.setSearch}
        onEdit={dashboardProducts.editProduct}
        onDelete={dashboardProducts.deleteProduct}
        onDeleteImage={dashboardProducts.deleteProductImage}
        isDeleting={dashboardProducts.isDeleting}
      />
    </div>
  );
};

export default ProductsModule;
