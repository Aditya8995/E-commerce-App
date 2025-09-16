const express = require('express');
const router = express.Router();
const products = require('../data/products');
const {getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts} = require('../controllers/productController');  
const { protect, admin } = require('../middleware/authMiddleware.js');


router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/top').get(getTopProducts);

router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;