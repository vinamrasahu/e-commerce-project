import express from "express";
import {
  register,
  login,
  sendOtp,
  resetPassword,
  sendRegisterOtp,
  verifyRegisterOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);

router.post("/send-register-otp", sendRegisterOtp);
router.post("/verify-register-otp", verifyRegisterOtp);

export default router;