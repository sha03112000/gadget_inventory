import joi from "joi";
export const productSchema = joi.object({
    name: joi.string().min(3).max(50).required(),
    // description: joi.string().min(3).max(200).optional(),
    price: joi.number().required(),
    stock: joi.number().required(),
    // image: joi.string().uri().allow('', null).optional(),
    color: joi.string().allow('', null).min(3).max(30).optional(),
    ram: joi.number().allow('', null).optional(),
    storage: joi.number().allow('', null).optional(),
    category: joi.string().hex().length(24).required(), // Assuming MongoDB ObjectId
});