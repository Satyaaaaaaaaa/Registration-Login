const express= require('express');
const router = express.Router();
const { loginValidation, signupValidation } = require('../middlewares/validation');
const { login, signup } = require('../controllers/controller')


router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

module.exports = router;