import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { gatewayTokenGenerator } from "../middleware/gatewayTokenGenerator.js";
import axios from "axios";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      let user = await User.findById(decoded.userId).select("-password");

      // Fetch API Gateway accounts
      if (!user) {
        const token = gatewayTokenGenerator();
        const { data: apiAccounts } = await axios.get(
          `${process.env.API_GATEWAY_URL}/admin/get-accounts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Find user in API Gateway accounts
        user = apiAccounts.find((account) => account._id === decoded.userId);

        if (user) {
          // Attach API Gateway user to request
          req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
          return next();
        }
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired!" });
      }
      throw error;
    }
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Unauthorized - Invalid access token",
        error: error.message,
      });
  }
};


export const adminRoute = async ( req, res, next ) =>{
    if(req.user && req.user.role === "admin"){
        next()
    } else{
        return res.status(403).json({ message: "Access denied - Admin only"})
    }
}