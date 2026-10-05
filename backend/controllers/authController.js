import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import UserSession from "../models/UserSession.js";
import RegisterOtp from "../models/RegisterOtp.js";
import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";
import { sendEmail } from "../services/emailService.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    console.log(result);
    const sessionId = uuidv4();
    
    const token = jwt.sign(
      {
        id: user._id,
        sessionId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    
    await UserSession.create({
      userId: user._id,
    
      sessionId,
    
      loginTime: new Date(),
    
      lastSeen: new Date(),
    
      device: result.device.type || "Desktop",
    
      browser: result.browser.name,
    
      os: result.os.name,
    
      ip: req.ip,
    
      status: "Active",
    });

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
  
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
  
      user.otp = otp;
      user.otpExpiry = Date.now() + 5 * 60 * 1000;
  
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP is ${otp}`,
      });
  
      res.json({
        success: true,
        message: "OTP sent",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  export const resetPassword = async (
    req,
    res
  ) => {
    try {
      const {
        email,
        otp,
        newPassword,
      } = req.body;
  
      const user = await User.findOne({
        email,
      });
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      if (
        user.otp !== otp ||
        user.otpExpiry < Date.now()
      ) {
        return res.status(400).json({
          message: "Invalid OTP",
        });
      }
  
      user.password = await bcrypt.hash(
        newPassword,
        10
      );
  
      user.otp = null;
      user.otpExpiry = null;
  
      await user.save();
  
      res.json({
        success: true,
        message: "Password Updated",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };
  export const sendRegisterOtp = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log("sendRegisterOtp called");
      console.log(req.body);
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
  
      const exist = await User.findOne({ email });
  
      if (exist) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
  
      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await RegisterOtp.findOneAndDelete({ email });
  
      await RegisterOtp.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
      });
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });
   
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Registration OTP",
        text: `Your OTP is ${otp}`,
      });
      console.log("Email sent successfully");
      res.json({
        success: true,
        message: "OTP sent successfully",
      });
  
    } catch (err) {
  
      res.status(500).json({
        success: false,
        message: err.message,
      });
  
    }
  };

  export const verifyRegisterOtp = async (req, res) => {
    try {
  
      const { email, otp } = req.body;
  
      const data = await RegisterOtp.findOne({
        email,
      });
  
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "OTP not found",
        });
      }
  
      if (data.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
  
      if (data.otpExpiry < Date.now()) {
        return res.status(400).json({
          success: false,
          message: "OTP Expired",
        });
      }
  
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
      });
  
      await RegisterOtp.deleteOne({
        email,
      });
  
      res.status(201).json({
        success: true,
        message: "Registration Successful",
        user,
      });
  
    } catch (err) {
  
      res.status(500).json({
        success: false,
        message: err.message,
      });
  
    }
  };

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await UserSession.find()
      .populate("userId", "name email")
      .sort({ loginTime: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};