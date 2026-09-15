import { Products } from "../Models/Products.js";



// Add product
export const addProduct = async (req, res) => {

    const {
        title,
        description,
        price,
        category,
        qty,
        imgSrc
    } = req.body; 

    try {

        const product = await Products.create({
            title,
            description,
            price,
            category,
            qty,
            imgSrc
        });

        return res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};


//get products

export const getProducts = async (req, res) => {

    try {

        const products = await Products
            .find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All products",
            products
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};


//find product by id

export const getProductById = async (req, res) => {

    try {

        const id = req.params.id;

        const product = await Products.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Specific product",
            success: true,
            product
        });

    } catch (error) {

        console.log("Get product error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

//update product by id 
export const getProductByIdAndUpdate = async (req, res) => {

    try {

        const id = req.params.id;

        const product = await Products.findByIdAndUpdate(id,req.body,{new:true});

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product Updated",
            success: true,
            product
        });

    } catch (error) {

        console.log("Get product error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


//delete product by id 

export const deleteById = async (req,res)=>{
    try {

        const id = req.params.id;

        const product = await Products.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product Deleted",
            success: true
            
        });

    } catch (error) {

        console.log("Delete product error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
