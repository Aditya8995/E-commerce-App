const express = require('express');
const router = express.Router();
const {authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, getUserById, deleteUser, updateUser} = require('../controllers/userController');
const {protect, admin} = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect,admin,getUsers);
router.post('/auth', authUser);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.post('/logout', logoutUser);
router.route('/:id').get(protect,admin,getUserById).delete(protect,admin,deleteUser).put(protect,admin,updateUser);

module.exports = router;