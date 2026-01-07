import { Router } from "express";
const router = Router();

import {
  registerUser,
  loginUser,
  getLoggedInUser,
} from "../controller/authController.js";

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get current user
router.get("/me", getLoggedInUser);

export default router;
