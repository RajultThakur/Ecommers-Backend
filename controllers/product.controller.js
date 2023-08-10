const Product = require('../models/product');
const {User, Role} = require('../models/user');

// this route should be protected only admin or a seller can list the product. 
const listProduct = async (req, res) => {
    const {title, description, img, price, stock, brand, category,status, rating, seller } = req.body;

    try {
        let valid = title || description || img || price || stock || brand || category || status || rating || seller;

        if(!valid){
            return res.status(401).json({
                success : false,
                message : "all fields required"
            })
        }

        const _seller = await User.findById({_id : seller});

        if(_seller.role == Role.USER){
            return res.status(401).json({
                success : false,
                message : "only seller or admin can add products"
            })
        }

        const products = await Product.find({title,img});

        if(products){
            return res.status(401).json({
                success : false,
                message : "product is already listed with same title, and image"
            })
        }

        const newProduct = new Product({
            title,
            description, 
            img,
            price,
            stock,
            brand,
            category,
            status,
            rating,
            seller
        })

        await newProduct.save();

        return res.status(201).json({
            success : true,
            product : products
        })
        
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }

}

const getProducts = async (req, res) => {
    let success = false;
    const { name, price, rating, category } = req.query;

    try {
        let query;
        if (category) {
            const _category = category.split(" ");
            query = Product.find({ category: { $in: _category } });
        } else if (name) {
            query = Product.find({ title: { $regex: name, $options: 'i' } });
        } else {
            query = Product.find();
        }

        if (price || rating) {
            if (price && rating) {
                query = query.sort({ rating: rating, price: price });
            } else if (price) {
                query = query.sort({ price: price });
            } else {
                query = query.sort({ rating: rating });
            }
        }

        const products = await query.populate({
            path: "seller",
            model: "User",
            select: ["name", "email"]
        });

        success = true;

        return res.status(201).json({
            success,
            products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

const getProductById = async(req, res) => {
    const {id} = req.params;

    try {
        const product = await Product.findById(id);
        return res.status(201).json({
            success : true,
            data : product
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
}

module.exports = { listProduct, getProducts, getProductById };