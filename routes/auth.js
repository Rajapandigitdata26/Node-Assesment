const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.get('/', (req, res) => {
	if (req.session && req.session.userId) {
		return res.redirect('/posts');
	}
	res.redirect('/login');
});

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/logout', authController.logout);
router.get('/change-password', authController.getChangePassword);
router.post('/change-password', authController.postChangePassword);

module.exports = router;
