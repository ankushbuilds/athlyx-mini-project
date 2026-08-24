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

router.get("/settings", authMiddleware, authController.getSettings);
router.put("/settings", authMiddleware, authController.updateSettings);

module.exports = router;
 