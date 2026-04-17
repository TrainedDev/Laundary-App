const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(orderController.getOrders).post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrderById)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
