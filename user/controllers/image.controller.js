import multer from "multer";
import mongoose from "mongoose";

// Define the schema for storing image information
const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const Image = mongoose.model("Image", imageSchema);

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export const uploadImage = upload.single("image");

export const saveImageToDatabase = async (req, res, next) => {
  try {
    const image = new Image({
      filename: req.file.filename,
      path: req.file.path,
    });

    await image.save();

    return res
      .status(200)
      .send(req.file.filename); 
  } catch (error) {
    console.error("Error saving image to database:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getImagePath = (req, res) => {
  res.status(200).send({ imagePath: `${filename}` });
};