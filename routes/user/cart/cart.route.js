const { addToCart, removeFromCart, updateCartItems, getMyCartItems } = require('../../../controllers/user/cart/cart.controller');
const isAuthenticated = require('../../../middleware/isAuthenticated');
const catchAsync = require('../../../services/catchAsync');

const router = require('express').Router();

router.route("/:bookId")
.post(isAuthenticated,catchAsync(addToCart))  // we are adding books in a cart with that book id , bookId = req.params.id (if req.params.bookId, then need to use route("/:bookId"))->remember
.delete(isAuthenticated,catchAsync(removeFromCart)) // remove book from cart with that book id , bookId = req.params.id (if req.params.bookId, then need to use route("/:bookId"))
.patch(isAuthenticated,catchAsync(updateCartItems))   // update cart items
router.route("/").get(isAuthenticated,catchAsync(getMyCartItems)) // get all cart items of that user

module.exports = router;