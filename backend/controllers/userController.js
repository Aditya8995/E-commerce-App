const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// authorize user
const authUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(401);
        throw new Error('Invalid email or password');
    }
    else{
        if(await user.matchPassword(password)){
            generateToken(res, user._id);

            res.status(200).json({
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
          });
        }
        else{
            res.status(401);
            throw new Error('Invalid email or password');
        }   
    }
  });


// register user
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({name, email, password});
    if(user){
      generateToken(res, user._id); 
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    }
    else{
      res.status(400);
      throw new Error('Invalid user data');
    }
  });


  // logoutUser
const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({message: 'Logged out successfully'});
  });


// get profile
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    if(user){
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      })
    }
    else{
      res.status(404)
      throw new Error('User Not Found')
    }
  });


const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if(req.body.password){
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      });
    }
    else{
      res.status(404);
      throw new Error('User Not Found');  
    }
  });


const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
  });


const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
      res.status(200).json(user);
    }
    else{
      res.status(404);
      throw new Error('User Not Found');  
  }
});



const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
      if(user.isAdmin){
        res.status(400);
        throw new Error('Cannot delete admin user');
      }
      await User.deleteOne({_id: user._id});
      res.status(200).json({message: 'User deleted'});
    }
    else{
      res.status(404);
      throw new Error('User Not Found');
    }
  });


const updateUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      });
    }
    else{
      res.status(404);
      throw new Error('User Not Found');
    }
  });

module.exports = {authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, getUserById, deleteUser, updateUser};    
