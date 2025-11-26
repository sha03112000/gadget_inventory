import express from "express";
import categoryController from "../controllers/categoryController";
import productController from "../controllers/productController";
import upload from "../config/multerConfig";


const router = express.Router();

// =========================================================== categories routes ========================================================== //

//add, view category
router.
  route('/categories')
  .post(categoryController.addCategory)
  .get(categoryController.viewCategories)

// category by id, update, delete ,view single category;
router
  .route('/categories/:id')
  .get(categoryController.singleCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)


// ============================================================== Products =================================================== //

router
  .route("/products")
  .get(productController.viewProducts)
  .post(upload.single("image"), productController.addProduct);

// products by category
router
  .route("/products/category/:categoryId")
  .get(productController.viewProductsByCategory);

// view single product, update, delete product
router
  .route("/products/:id")
  .get(productController.viewSingleProduct)
  .put((req, res, next) => {
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    next();
  },upload.single("image"), productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;