// 3rd Party Imports
const express = require('express');
// Custom Imports
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

const { getAllUsers, createUser, getUser, updateUser, deleteUser } =
  userController;

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = authController;

// AUTH CONTROLLER
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

// USER CONTROLLER
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
