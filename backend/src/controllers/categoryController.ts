import { Request, Response } from "express";
import categoryModel from "../models/categoryModel";
import Product from "../models/productsModel";
import { categorySchema } from "../validations/categoryValidation";
import { HttpStatusCode } from "../constants/httpStatusCodes";


const today = new Date();

// add category
export const addCategory = async (req: Request, res: Response) => {
    try {

        const { error, value } = categorySchema.validate(req.body, {
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

        // check uniqueness of category name
        const existingCategory = await categoryModel.findOne({ name: value.name });

        if (existingCategory) {
            return res
                .status(HttpStatusCode.CONFLICT)
                .json({ success: false, message: "Category name already exists" });
        }

        const { name, description } = value;
        const category = new categoryModel({ name, description, createdAt: today });

        await category.save();

        return res.status(HttpStatusCode.CREATED).json({
            message: "Category added successfully",
            success: true
        });
    } catch (err) {
        console.log(err);
        res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ success: false, error: "Error creating user" });
    }
};

export const viewCategories = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = parseInt(req.query.limit as string) || 250;

        // calculate how many to skip
        const skip = (page - 1) * limit;

        const categories = await categoryModel.find(
            {
                is_active: true
            },
        ).skip(skip).limit(limit).sort({ createdAt: -1 });

        const catogoryCount = await categoryModel.countDocuments();

        res.status(HttpStatusCode.OK).json({ success: true, categories, pagination: { page, limit, total: catogoryCount, pages: Math.ceil(catogoryCount / limit), } });
    } catch (err) {
        console.log(err);
        res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ success: false, error: "Error getting categories" });
    }
};

export const singleCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryModel.findOne({ _id: categoryId });
        if (!category) {
            return res
                .status(HttpStatusCode.NOT_FOUND)
                .json({ success: false, message: "Category not found" });
        }
        return res.status(HttpStatusCode.OK).json({ success: true, category });
    } catch (err) {
        console.log(err);
        res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ success: false, error: "Error getting category" });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;

        const { error, value } = categorySchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                error: error.details.map((err) => err.message),
                message: "Validation Error",
            });
        }

        // Prevent MongoDB error if value.name is missing
        if (value.name) {
            const existingCategory = await categoryModel.findOne({
                name: value.name,
                _id: { $ne: categoryId }
            });

            if (existingCategory) {
                return res.status(HttpStatusCode.CONFLICT).json({
                    success: false,
                    message: "Category name already exists"
                });
            }
        }

        const { name, description } = value;

        const update = await categoryModel.findOneAndUpdate(
            { _id: categoryId },
            { name, description, updatedAt: today },
            { new: true }
        );

        if (!update) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Category updated successfully",
        });

    } catch (err) {
        console.log(err);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: "Server error while updating category"
        });
    }
};


export const deleteCategory = async (req : Request, res: Response) => {
  try {
    const categoryId = req.params.id;

    // 1️⃣ Check if products exist under this category
    const productCount = await Product.countDocuments({ category: categoryId });

    if (productCount > 0) {
      return res.status(HttpStatusCode.CONFLICT).json({
        success: false,
        message: "Cannot delete category because products exist under this category.",
      });
    }

    // 2️⃣ Safe to delete
    const category = await categoryModel.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error while deleting category",
    });
  }
};


const categoryController = {
    addCategory,
    viewCategories,
    updateCategory,
    deleteCategory,
    singleCategory
};


export default categoryController;