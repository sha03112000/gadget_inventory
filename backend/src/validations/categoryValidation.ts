import Joi from "joi";

export const categorySchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().allow(null, "").optional(),
});
