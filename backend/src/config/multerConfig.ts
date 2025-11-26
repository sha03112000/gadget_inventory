import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "phone_app/products",
    resource_type: "image",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});



const upload = multer({ storage });

export default upload;