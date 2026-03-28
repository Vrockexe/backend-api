const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS package
const app = express();

const Db = "mongodb+srv://yoyoalaa430:yoyo1alaa@cluster0.ppyav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Import routes
const authRouter = require("./routes/auth");
const { auth } = require('./middleware/auth');
const categoryRouter = require('./routes/category');
const bannerRouter = require('./routes/banner');
const productRouter = require('./routes/product');
const subCategoryRouter = require('./routes/subcategory');
const orderRouter = require("./routes/order");
const vendorRouter = require('./routes/vendor'); 

// Use CORS middleware
app.use(cors()); // This allows all origins. You can configure it further if needed.

app.use(express.json());
app.use(authRouter);
app.use(categoryRouter);
app.use(bannerRouter);
app.use(productRouter);
app.use(subCategoryRouter);
app.use(orderRouter);
app.use(vendorRouter);

const PORT = process.env.PORT || 3000;

mongoose.connect(Db).then(() => {
  console.log('connected');
}).catch((e) => {
  console.error('Database connection error:', e.message);
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
