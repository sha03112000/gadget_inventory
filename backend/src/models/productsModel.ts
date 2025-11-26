import mongoose, {Document} from "mongoose";    

export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    stock: number;
    image: string;
    color: string;
    ram: number;
    storage: number;
    category: mongoose.Schema.Types.ObjectId;
    is_active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number },
        image: { type: String },
        color: { type: String },
        ram: { type: Number},
        storage: { type: Number },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        is_active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;