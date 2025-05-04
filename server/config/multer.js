const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "User-management", // Single folder for all uploads
    resource_type: file.mimetype.startsWith("image") ? "image" : "raw", // Checks if it's an image or not
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    format: file.mimetype.split("/")[1], // Format (e.g., 'jpeg', 'pdf', etc.)
  }),
});

const upload = multer({ storage });

module.exports = { upload };
