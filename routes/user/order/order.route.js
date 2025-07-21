const { createOrder, getMyOrders, cancelOrder, updateMyOrder, deleteMyOrder } = require('../../../controllers/user/order/order.controller');
const isAuthenticated = require('../../../middleware/isAuthenticated');
const catchAsync = require('../../../services/catchAsync');


const router = require('express').Router();

router.route("/")
.post(isAuthenticated, catchAsync(createOrder))  // create a new order
.get(isAuthenticated, catchAsync(getMyOrders));   // get all orders of that user  

router.route("/cancel").patch(isAuthenticated,catchAsync(cancelOrder))  // cancel an order by its ID, which is passed as a parameter in the URL

router.route("/:id")
.patch(isAuthenticated,catchAsync(updateMyOrder))     // update a single order by its ID, which is passed as a parameter in the URL
.delete(isAuthenticated,catchAsync(deleteMyOrder));      // delete a single order by its ID, which is passed as a parameter in the URL


module.exports = router;