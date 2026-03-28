const express = require('express');
const subCategoryRouter = express.Router();
const SubCategory = require('../models/sub_category_models');
const Category = require('../models/category_models');

subCategoryRouter.post('/api/subcategories', async (req, res) => {
   try {
       const { categoryId, categoryName, image, subcategoryName } = req.body;
       const subcategory = new SubCategory({ categoryId, categoryName, image, subcategoryName });
       await subcategory.save();
       res.status(201).send(subcategory);
   } catch (error) {
       console.error('Error creating subcategory:', error);
       res.status(400).json({ error: error.message });
   }
});

subCategoryRouter.get('/api/subcategories', async (req, res) => {
    try {
      const subcategories = await SubCategory.find();
      res.status(200).json(subcategories);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });


subCategoryRouter.get('/api/category/:categoryName/subcategories', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        // Assuming you have a relationship between Category and SubCategory models
        // Adjust this query according to your database schema
        const subcategories = await SubCategory.find({
            categoryName: { $regex: new RegExp('^' + categoryName + '$', 'i') }
          });
          
        if (!subcategories) {
            return res.status(404).json({ error: 'Subcategories not found' });
        }
        res.status(200).json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = subCategoryRouter;
