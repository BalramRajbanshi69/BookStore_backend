const { getAllOrders, getSingleOrder, updateOrderStatus, deleteOrder, updatePaymentStatus } = require('../../controllers/admin/orders/orders.controller');
const isAuthenticated = require('../../middleware/isAuthenticated');
const permitTo = require('../../middleware/permitTo');
const catchAsync = require('../../services/catchAsync');


const router = require('express').Router();

router.route("/orders").get(isAuthenticated,permitTo("ADMIN"),catchAsync(getAllOrders))
router.route("/orders/paymentstatus/:id").patch(isAuthenticated,permitTo("ADMIN"),catchAsync(updatePaymentStatus))
router.route("/orders/:id")
.get(isAuthenticated,permitTo("ADMIN"),catchAsync(getSingleOrder))
.patch(isAuthenticated,permitTo("ADMIN"),catchAsync(updateOrderStatus)) // update order status by its ID, which is passed as a parameter in the URL
.delete(isAuthenticated,permitTo("ADMIN"),catchAsync(deleteOrder))


module.exports = router;