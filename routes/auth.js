const express = require("express");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user_models");
const { auth } = require("../middleware/auth");


const authRouter = express.Router();

authRouter.post('/api/signup', async(req, res) => {
   try{
    const { name, email, password } = req.body;

    const existingEmail  = await  User.findOne({email});
    if(existingEmail){
        return res.status(400).json({msg: 'user with same email already exits'});

    }else{
    const hashedPassword= await  bcryptjs.hash(password, 8);
     var user = new User({
        email,
        password: hashedPassword,
        name,
     });

     user= await user.save();
     res.json({user});
    }
   }catch(e){
      console.error(e);
      res.status(500).json({ error:  e.message});
   }
});


authRouter.post('/api/signin', async (req, res) => {
   try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({ msg: "User not found with this email" });
    } else {
       const isMatch = await bcryptjs.compare(password, findUser.password);
       if (!isMatch) {
         return res.status(400).json({ msg: "Incorrect Password" });
       } else {
         const token = jwt.sign({ id: findUser._id }, "passwordKey");
         res.json({ token, ...findUser._doc });
       }
    }
   } catch(e) {
      res.status(500).json({ error: e.message });
   }
});

// PUT update user location (state, city, locality)
authRouter.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { state, city, locality } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { state, city, locality },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user location error:", error.message);
    res.status(500).json({ error: "Failed to update user location" });
  }
});


authRouter.post("/tokenIsValid", async (req, res) => {
   try {
     const token = req.header("x-auth-token");
     if (!token) return res.json(false);
     const verified = jwt.verify(token, "passwordKey");
     if (!verified) return res.json(false);
 
     const user = await User.findById(verified.id);
     if (!user) return res.json(false);
     res.json(true);
   } catch (e) {
     res.status(500).json({ error: e.message });
   }
 });

// get user data
authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});


//sign out 
authRouter.post('/api/signout', auth, async (req, res) => {
   try {
     // Clear the user's token (optional)
     // This depends on your specific requirements
     // You may want to remove the token from the client-side as well
     res.clearCookie('x-auth-token');
     
     // Respond with success message

     res.json({ msg: 'User successfully signed out' });
   } catch (e) {
     // Handle any errors
     res.status(500).json({ error: e.message });
   }
 });
 authRouter.delete("/api/user/delete-account/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
 
authRouter.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json([]);
    }
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


authRouter.delete("/api/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


module.exports = authRouter;