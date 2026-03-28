const express = require('express');
const { auth } = require('../middleware/auth');
const {Product} = require('../models/product_model');
const productRouter = express.Router();

productRouter.post('/post/add-product', async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      quantity,
      description,
      category,
      subCategory,     
      vendorId,       
      name,           
      images
    } = req.body;

    const product = new Product({
      productName,
      productPrice,
      quantity,
      description,
      category,
      subCategory,    
      vendorId,        
      name,            
      images
    });

    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//get products

productRouter.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  //get product by category

productRouter.get('/category/products', async (req, res) => {
    try {
        // Check if category query parameter is provided
        const category = req.query.category;
        let products;
        if (category) {
            // Find products where category matches the query parameter
            products = await Product.find({ category: category });
        } else {
            // If no category provided, return all products
            products = await Product.find();
        }
        res.status(200).json(products); // Send the products as JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Send error response
    }
});

productRouter.get('/api/products-by-subcategory/:subcategory', async (req, res) => {
  try {
    const subcategory = req.params.subcategory;

    // Fetch products that match the subcategory
    const products = await Product.find({ subCategory: subcategory });

    if (!products || products.length === 0) {
      return res.status(404).json([]);
    }

    res.status(200).json(products);
  } catch (e) {
    console.error('Error loading products by subcategory:', e.message);
    res.status(500).json({ error: 'Failed to fetch products by subcategory' });
  }
});
// / Add a new route to get recommended products
productRouter.get('/api/popular-products', async (req, res) => {
  try {
    const products = await Product.find({ popular: true }).limit(10);
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load popular products' });
  }
});

productRouter.get('/api/products/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const products = await Product.find({ vendorId });

    if (!products || products.length === 0) {
      return res.status(200).json([]); // Return empty list instead of 404
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
productRouter.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true } // return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = productRouter;

