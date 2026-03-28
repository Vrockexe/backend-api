 const express = require('express'); 
const Banner = require('../models/banner_models');


const bannerRouter = express.Router();

bannerRouter.post("/api/banner", async (req, res) => {
   try {
      const { image } = req.body;

      const banner = new Banner({ image });
      await banner.save();
      return res.status(200).send(banner);
   } catch (error) {
      console.error('Error creating banner:', error);
      res.status(400).json({ error: error.message });
   }
});


//get banner

bannerRouter.get('/api/banner', async(req, res)=>{
   try {
   const banners = await Banner.find();
   res.status(200).send(banners);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
})

module.exports = bannerRouter; 