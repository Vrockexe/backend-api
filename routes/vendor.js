const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor_model");
const { auth } = require("../middleware/auth"); 

const vendorRouter = express.Router();

// Vendor Signup
vendorRouter.post("/api/vendor/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ msg: "Vendor with same email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    let vendor = new Vendor({
      name,
      email,
      password: hashedPassword,
      state: "",
      city: "",
      locality: "",
      role: "vendor",
      token: "",
      storeImage: "",
      storeDescription: "",
    });

    vendor = await vendor.save();
    res.status(201).json(vendor);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all vendors
vendorRouter.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    if (!vendors || vendors.length === 0) {
      return res.status(404).json([]);
    }
    res.status(200).json(vendors);
  } catch (err) {
    console.error('Error fetching vendors:', err.message);
    res.status(500).json({ error: 'Failed to load vendors' });
  }
});

// Vendor Signin
vendorRouter.post("/api/vendor/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ msg: "Vendor not found." });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: vendor._id }, "passwordKey");
    vendor.token = token;
    await vendor.save();

    res.json({ token, vendor });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


vendorRouter.post("/api/signout", auth, async (req, res) => {
  try {
    // Optionally clear token in DB here
    res.status(200).json({ message: "Signed out successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

vendorRouter.delete("/api/vendors/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVendor = await Vendor.findByIdAndDelete(id);

    if (!deletedVendor) {
      return res.status(404).json({ msg: "Vendor not found" });
    }

    res.status(200).json({ msg: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Get all vendors
vendorRouter.get("/api/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ Delete vendor by ID
vendorRouter.delete("/api/vendors/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({ msg: "Vendor not found" });
    }

    res.status(200).json({ msg: "Vendor deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


module.exports = vendorRouter;
