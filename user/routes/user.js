import express from 'express'
import { getAllUsers, getById, updateById } from '../controllers/user.controller.js';
import { uploadImage,  saveImageToDatabase } from "../controllers/image.controller.js";
  
const router = express.Router();

// Get All
router.get('/', getAllUsers)

// Get by id
router.get('/:id', getById)

// Update by id
router.put('/update/:id', updateById)

// Image routes
router.post("/images", uploadImage, saveImageToDatabase);


export default router;