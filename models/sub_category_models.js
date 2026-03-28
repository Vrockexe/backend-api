const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    categoryId: {
        type: String,
        required: true,
    
    },
    categoryName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    subcategoryName: {
        type: String,
        required: true,
      
    }
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;