import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HomePage } from "./components/HomePage";
import { AddProduct } from "./components/AddProduct";
import { UpdateProduct } from "./components/UpdateProduct";
import { ProductView } from "./components/ProductView";
import { CategoryPage } from "./components/CategoriesPage";
import { DeleteConfirmation } from "./components/DeleteConfirmation";
import { BottomNav } from "./components/BottomNav";
import { AddCategory } from "./components/AddCategory";
import { useDeleteCategoryMutation, useDeleteProductMutation, useGetProductsQuery } from "./store/slices/apiSlice";


export type Category = {
  _id: string;
  name: string;
};

export type Product = {
  _id: number | string;
  name: string;
  category: Category;
  color: string;
  ram: string;
  storage: string;
  price: number;
  stock: number;
  image: string;
};

export type Screen =
  | "welcome"
  | "home"
  | "all-categories"
  | "all-products"
  | "add-product"
  | "update-product"
  | "product-view"
  | "delete-confirmation"
  | "add-category"
  | "settings";

export default function App() {
  // ----------- SCREEN PERSISTENCE -----------
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");

    if (!hasSeenWelcome) return "welcome";

    return (localStorage.getItem("lastScreen") as Screen) || "home";
  });

  useEffect(() => {
    localStorage.setItem("lastScreen", currentScreen);
  }, [currentScreen]);

  // ------------------- STATE --------------------
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const [deleteMode, setDeleteMode] = useState<"product" | "category">("product");

  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const { data: productsData, isLoading, isError } = useGetProductsQuery(undefined);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.products || []);
    }
    console.log("PRODUCTS DATA:", productsData);
  }, [productsData]);


  const [categoryMode, setCategoryMode] = useState<"add" | "edit">("add");

  // ------------------- HANDLERS --------------------


  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(selectedProduct._id).unwrap();
      setSelectedProduct(null);
      setCurrentScreen("all-products");

      alert("Product deleted!");
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory._id).unwrap();
      setSelectedCategory(null);
      setCurrentScreen("all-categories");

      alert("Category deleted!");

    } catch (err: any) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category");
    }
  };

  const openDeleteProductModal = (product: any) => {
    setSelectedProduct(product);
    setDeleteMode("product");
    setCurrentScreen("delete-confirmation");
  };

  const openDeleteCategoryModal = (category: any) => {
    setSelectedCategory(category);
    setDeleteMode("category");
    setCurrentScreen("delete-confirmation");
  };

  // ------------------- RENDER --------------------

  const showBottomNav = currentScreen !== "welcome";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* WELCOME SCREEN */}
        {currentScreen === "welcome" && (
          <WelcomeScreen
            onGetStarted={() => {
              localStorage.setItem("hasSeenWelcome", "true");
              setCurrentScreen("home");
            }}
          />
        )}

        {/* HOME */}
        {currentScreen === "home" && (
          <HomePage
            products={products}
            onViewProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen("product-view");
            }}
            onAddProduct={() => setCurrentScreen("add-product")}
          />
        )}

        {/* ALL PRODUCTS */}
        {currentScreen === "all-products" && (
          <HomePage products={products} onViewProduct={
            (p) => {
              setSelectedProduct(p);
              setCurrentScreen("product-view");
            }
          } showAll 
           onAddProduct={() => setCurrentScreen("add-product")}/>
        )}
       

        {/* UPDATE PRODUCT */}
        {currentScreen === "update-product" && selectedProduct && (
          <UpdateProduct
            product={selectedProduct}
            onCancel={() => setCurrentScreen("product-view")}
            onUpdate={(updatedProduct) => {
              // update list
              setProducts((prev) =>
                prev.map((p) =>
                  p._id === updatedProduct._id ? updatedProduct : p
                )
              );

              // update selected product
              setSelectedProduct(updatedProduct);

              // go back to product view
              setCurrentScreen("product-view");
            }}
          />
        )}

        {/* ADD PRODUCT */}
        {currentScreen === "add-product" && (
          <AddProduct
            onCancel={() => setCurrentScreen("all-products")}
          />
        )}

        {/* PRODUCT VIEW */}
        {currentScreen === "product-view" && selectedProduct && (
          <ProductView
            product={selectedProduct}
            onEdit={() => setCurrentScreen("update-product")}
            onDelete={() => openDeleteProductModal(selectedProduct)}
            onBack={() => setCurrentScreen("all-products")}
          />
        )}


        {/*//////////////// Category Section ////////////////*/}

        {/* CATEGORY LIST */}
        {currentScreen === "all-categories" && (
          <CategoryPage
            onAddCategory={() => {
              setCategoryMode("add");
              setSelectedCategory(null);
              setCurrentScreen("add-category");
            }}
            onEditCategory={(cat) => {
              setCategoryMode("edit");
              setSelectedCategory(cat);
              setCurrentScreen("add-category");
            }}
            onDeleteCategory={openDeleteCategoryModal}
          />
        )}

         

        {/* ADD/EDIT CATEGORY */}
        {currentScreen === "add-category" && (
          <AddCategory
            onBack={() => setCurrentScreen("all-categories")}
            initialData={selectedCategory}
            mode={categoryMode}
            onDelete={() => openDeleteCategoryModal(selectedCategory)}

          />
        )}

        

        

        {/* DELETE CONFIRMATION */}
        {currentScreen === "delete-confirmation" && (
          <DeleteConfirmation
            mode={deleteMode}
            item={
              deleteMode === "product" ? selectedProduct! : selectedCategory!
            }
            onConfirm={
              deleteMode === "product"
                ? handleDeleteProduct
                : handleDeleteCategory
            }
            onCancel={() =>
              setCurrentScreen(
                deleteMode === "product" ? "product-view" : "all-categories"
              )
            }
          />
        )}

        {/* SETTINGS */}
        {currentScreen === "settings" && (
          <div className="p-6">
            <h1 className="mb-6">Settings</h1>
            <p className="text-gray-500">Settings page coming soon...</p>
          </div>
        )}

        {/* BOTTOM NAV */}
        {showBottomNav && (
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </div>
    </div>
  );
}
