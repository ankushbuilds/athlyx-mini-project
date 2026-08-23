const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const authMiddleware = require("../middleware/auth.middleware");

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

router.get('/me', authMiddleware, authController.getCurrentUser); 

router.delete('/delete-account', authMiddleware, authController.deleteAccount);

router.put("/change-password", authMiddleware, authController.changePassword);
router.put("/change-email", authMiddleware, authController.changeEmail);

module.exports = router;
 