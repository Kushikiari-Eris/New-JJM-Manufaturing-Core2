import FinishProduct from "../models/finishProduct.model.js";
import cloudinary from "../config/cloudinary.js";
import { gatewayTokenGenerator } from "../middleware/gatewayTokenGenerator.js";
import axios from "axios";

// Create a new finished product
export const createFinishedProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await FinishProduct.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
  
};


                

            

// Fetch all finished products
export const getFinishedProducts = async (req, res) => {
  try {
    const products = await FinishProduct.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching finished products", error });
  }
};

// Fetch a single finished product by ID
export const getFinishedProductById = async (req, res) => {
  try {
    const product = await FinishProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
  
};
