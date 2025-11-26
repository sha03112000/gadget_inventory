import { Request, Response } from "express";
import productModel from "../models/productsModel";
import { productSchema } from "../validations/productsValidation";
import { HttpStatusCode } from "../constants/httpStatusCodes";
import categoryModel from "../models/categoryModel";

const today = new Date();

// add product
export const addProduct = async (req: Request, res: Response) => {
    try {
        const { error, value } = productSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            console.log(error);
            res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({
                    success: false,
                    error: error.details.map((err) => err.message),
                    message: "Validation Error",
                });
            return;
        }

        //find category by id
        const categoryExists = await categoryModel.findById(value.category);
        if (!categoryExists) {
            return res
                .status(HttpStatusCode.NOT_FOUND)
                .json({ success: false, message: "Category not found" });
        }

        const { name, description, price, category, stock, color, ram, storage } = value;

        // Check if image was uploaded and get the Cloudinary URL
        const imageUrl = req.file ? req.file.path : null;

        const product = new productModel({
            name,
            description,
            price,
            category,
            stock,
            color,
            ram,
            storage,
            image: imageUrl,
            createdAt: today,
        });
        await product.save();

        return res.status(HttpStatusCode.CREATED).json({
            message: "Product added successfully",
            success: true
        });
    } catch (err) {
        console.log(err);
        res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ success: false, error: "Server error while adding product" });
    }
}

export const viewProducts = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = parseInt(req.query.limit as string) || 250;

        // calculate how many to skip
        const skip = (page - 1) * limit;

        const products = await productModel.find()
            .populate('category', 'name') // populate category details
            .skip(skip)
            .limit(limit);

        const total = await productModel.countDocuments();

        res.status(HttpStatusCode.OK).json({ success: true, products, pagination: { page, limit, total, pages: Math.ceil(total / limit), } });
    } catch (err) {
        console.log(err);
        res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ success: false, error: "Server error while fetching products" });
    }
}

export const viewSingleProduct = async (req: Request, res: Response) => {
    try {

        const productId = req.params.id;
        const product = await productModel.findById(productId).populate('category', 'name');
        if (!product) {
            return
            res.status(HttpStatusCode.NOT_FOUND).json({
                success: false, message: "Product not found"
            });
        }

        return res.status(HttpStatusCode.OK).json({
            success: true, product
        });

    } catch (err) {
        console.log(err);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({
                success: false, error: "Server error while fetching product"
            })
    }
}


export const viewProductsByCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryExists = await categoryModel.findById(categoryId);
        if (!categoryExists) {
            return res
                .status(HttpStatusCode.NOT_FOUND)
                .json({ success: false, message: "Category not found" });
        }
        const products = await productModel.find({ category: categoryId }).populate('category', 'name');
        if (products.length === 0) {
            return res
                .status(HttpStatusCode.NOT_FOUND)
                .json({ success: false, message: "No products found in this category" });
        }
        return res.status(HttpStatusCode.OK).json({ success: true, products });
    } catch (err) {
        console.log(err);
        res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ success: false, error: "Server error while fetching products by category" });
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;

        // Validate body
        const { error, value } = productSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                error: error.details.map((err) => err.message),
                message: "Validation Error",
            });
        }

        const { name, description, price, category, stock, color, ram, storage } = value;

        // Find product
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: "Product not found" });
        }

        // Image
        const imageUrl = req.file ? req.file.path : product.image; // Cloudinary or multer destination path



        const today = new Date();

        // Update product
        const updated = await productModel.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                price,
                category,
                stock,
                color,
                ram,
                storage,
                image: imageUrl,
                updatedAt: today,
            },
            { new: true }
        );

        return res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Product updated successfully",
            data: updated,
        });

    } catch (err) {
        console.log(err);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: "Server error while updating product",
        });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findByIdAndDelete(productId, { new: true });
        if (!product) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: "Product not found" });
        }
        return res.status(HttpStatusCode.OK).json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Server error while deleting product" });
    }
};




const productController = {
    addProduct,
    viewProducts,
    viewSingleProduct,
    viewProductsByCategory,
    updateProduct,
    deleteProduct
};

export default productController;