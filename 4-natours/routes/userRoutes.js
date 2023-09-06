// 3rd Party Imports
const express = require('express');
// Custom Imports
const userController = require('../controllers/userController');

const { getAllUsers, createUser, getUser, updateUser, deleteUser } =
  userController;

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
