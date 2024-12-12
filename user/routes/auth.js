import express from 'express'
import { login, registerAdmin, registerStylist, registerUser, sendEmail } from '../controllers/auth.controller.js';

const router = express.Router();

// Register
router.post("/register-user", registerUser)
router.post("/register-stylist", registerStylist)

// Login
router.post("/login", login)

// Register as Admin
router.post("/register-admin", registerAdmin)

// Send Reset Email
router.post("/send-email", sendEmail)

export default router;