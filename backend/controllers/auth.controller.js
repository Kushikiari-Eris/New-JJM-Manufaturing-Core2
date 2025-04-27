import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { redis } from "../config/redis.js"
import { gatewayTokenGenerator } from "../middleware/gatewayTokenGenerator.js";
import dotenv from "dotenv"
import axios from "axios";
import bcrypt from 'bcryptjs'
import speakeasy from 'speakeasy' // For 2FA
import QRCode from 'qrcode' // For generating QR codes

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // Reduced from 60m to 15m for better security
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Generate 2FA secret for a user
export const setup2FA = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Generate a secret
    const secret = speakeasy.generateSecret({
      name: `JJM_MANUFACTURING:${req.user.email}`
    });
    
    // Save the secret to the user record
    await User.findByIdAndUpdate(userId, {
      twoFactorSecret: secret.base32,
      twoFactorEnabled: false // Not enabled until the user verifies
    });
    
    // Generate QR code
    QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
      if (err) {
        return res.status(500).json({ message: "Error generating QR code" });
      }
      
      res.json({
        message: "2FA setup initiated",
        secret: secret.base32,
        qrCode: dataUrl
      });
    });
  } catch (error) {
    console.error("Error in setup2FA controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Verify and enable 2FA
export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: "2FA not set up" });
    }
    
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token
    });
    
    if (!verified) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    
    // Enable 2FA
    await User.findByIdAndUpdate(userId, { twoFactorEnabled: true });
    
    res.json({ message: "2FA enabled successfully" });
  } catch (error) {
    console.error("Error in verify2FA controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Disable 2FA
export const disable2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    
    // Verify token first
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token
    });
    
    if (!verified) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    
    // Disable 2FA
    await User.findByIdAndUpdate(userId, { 
      twoFactorEnabled: false,
      twoFactorSecret: null
    });
    
    res.json({ message: "2FA disabled successfully" });
  } catch (error) {
    console.error("Error in disable2FA controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Login flow with 2FA support
export const login = async (req, res) => {
  try {
    const { email, password, twoFactorToken } = req.body;

    // Fetch accounts from API Gateway
    const token = gatewayTokenGenerator();
    const { data: apiAccounts } = await axios.get(
      `${process.env.API_GATEWAY_URL}/admin/get-accounts`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Search in local database
    let user = await User.findOne({ email });

    // Search in API Gateway accounts if not found in DB
    if (!user) {
      const apiUser = apiAccounts.find((account) => account.email === email);
      if (apiUser) {
        // Create a local copy of the API user for future authentications
        user = new User({
          _id: apiUser._id,
          name: apiUser.name,
          email: apiUser.email,
          password: apiUser.password,
          role: apiUser.role
        });
        await user.save();
      }
    }

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      // Check if 2FA is enabled
      if (user.twoFactorEnabled) {
        // If 2FA is enabled but no token provided, ask for the token
        if (!twoFactorToken) {
          return res.status(200).json({ 
            requireTwoFactor: true,
            userId: user._id,
            message: "Please enter your 2FA code"
          });
        }
        
        // Verify 2FA token
        const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: twoFactorToken,
          window: 1 // Allow a bit of time drift
        });
        
        if (!verified) {
          return res.status(400).json({ message: "Invalid 2FA code" });
        }
      }

      // At this point, authentication is successful
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled || false
      });
    }

    res.status(400).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Complete 2FA verification after password login
export const verify2FALogin = async (req, res) => {
  try {
    const { userId, twoFactorToken } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // Verify 2FA token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorToken,
      window: 1 // Allow a bit of time drift
    });
    
    if (!verified) {
      return res.status(400).json({ message: "Invalid 2FA code" });
    }
    
    // Issue tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      twoFactorEnabled: true
    });
  } catch (error) {
    console.error("Error in verify2FALogin controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ 
      name, 
      email, 
      password,
      twoFactorEnabled: false,
      twoFactorSecret: null
    });

    // authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      twoFactorEnabled: false
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    // Check if refreshToken exists and has the correct format before verifying
    if (refreshToken && typeof refreshToken === 'string' && refreshToken.split('.').length === 3) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        // Only try to delete from Redis if decoding was successful
        if (decoded && decoded.userId) {
          await redis.del(`refresh_token:${decoded.userId}`);
        }
      } catch (tokenError) {
        // Just log the token error but continue with logout process
        console.log("Token verification failed during logout:", tokenError.message);
      }
    }

    // Always clear cookies, even if token verification failed
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Improved refresh token endpoint
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const { accessToken, newRefreshToken } = generateTokens(decoded.userId);
    
    // Update refresh token in Redis
    await storeRefreshToken(decoded.userId, newRefreshToken);
    
    // Set new cookies
    setCookies(res, accessToken, newRefreshToken);

    res.json({ message: "Tokens refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    
    // Clear cookies on error
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    
    res.status(401).json({ message: "Invalid or expired refresh token", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Include 2FA status in profile
    const user = req.user;
    res.json({
      ...user.toObject(),
      twoFactorEnabled: user.twoFactorEnabled || false
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login again." });
    }
    
    const userId = req.user._id;
    console.log("User ID for password update:", userId);

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Check if new password meets requirements
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: "New password must be at least 8 characters long" 
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log("Password will be updated for user:", user.email);

    // Update the password
    user.password = hashedPassword;
    const savedUser = await user.save();
    
    // Verify the update worked
    console.log("User saved successfully:", !!savedUser);
    
    // Double-check that we can verify the new password
    const verificationCheck = await bcrypt.compare(newPassword, savedUser.password);
    console.log("New password verification check:", verificationCheck);
    
    // Additional verification - retrieve user again to confirm changes persisted
    const freshUser = await User.findById(userId);
    console.log("Fresh user password hash matches saved hash:", 
                freshUser.password === savedUser.password);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}