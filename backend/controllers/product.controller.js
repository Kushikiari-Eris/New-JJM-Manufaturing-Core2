import { redis } from "../config/redis.js"
import Product from "../models/product.model.js"
import cloudinary from "../config/cloudinary.js"

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) =>{
    try {
        let featuredProducts = await redis.get("featured_products")
        if(featuredProducts) {
            return res.json(JSON.parse(featuredProducts))
        }

        featuredProducts = await Product.find({isFeatured:true}).lean()

        if(!featuredProducts) {
            return res.status(404).json({ message: "No featured products found"})
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts))
        res.json(featuredProducts)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message})
    }
}

export const createProduct = async (req, res) =>{
    try {
        const {name, description, price, category, image} = req.body

        let cloudinaryResponse = null

        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:"products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })

        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

export const deleteProduct = async (req, res) =>{
    try {
        const product = await Product.findById(req.params.id)

        if(!product) {
            return res.status(404).json({ message: "Product not found"})
        }

        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0]
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("Deleted image from cloudinary")
            } catch (error) {
                console.log("error deleting image from cloudinary")
            }
        }

        await Product.findByIdAndDelete(req.params.id)

        res.json({ message: "Product deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

export const getRecommendedProducts = async (req, res) =>{
    try {
        const products = await Product.aggregate([
            {
                $sample: {size:4}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }
            }
        ])

        res.json(products)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

export const getProductsByCategory = async (req, res) =>{
    const { category } = req.params
    try {
        const products = await Product.find({category})
        res.json({products})
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


async function updateFeaturedProductsCache() {
  try {
    // The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}

export const updateStatus = async (req, res) => {
   try {
     const { productId, quantity } = req.body;

     if (!productId || quantity === undefined) {
       return res.status(400).json({ error: "Invalid request data" });
     }

     // ✅ Ensure product exists
     const product = await Product.findById(productId);
     if (!product) {
       return res.status(404).json({ error: "Product not found" });
     }

     // ✅ Prevent stock from going negative when decrementing
     if (quantity < 0 && product.stock < Math.abs(quantity)) {
       return res.status(400).json({ error: "Not enough stock available" });
     }

     // ✅ Update stock (increment or decrement)
     const updatedProduct = await Product.findOneAndUpdate(
       { _id: productId },
       { $inc: { stock: quantity } }, // Can be + or -
       { new: true }
     );

     res.json({
       message: `Stock ${
         quantity > 0 ? "increased" : "decreased"
       } successfully`,
       product: updatedProduct,
     });
   } catch (error) {
     console.error("❌ Error updating stock:", error);
     res.status(500).json({ error: "Internal server error" });
   }
};
