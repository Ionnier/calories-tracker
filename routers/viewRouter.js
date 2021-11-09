const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController');
router.get('/login', function (req, res) {
    res.render('login', { message: "Log In" })
})
router.get('/signup', (req, res) => {
    res.render('signup', { message: "Sign Up" })
})
router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', { title: "Home", message: "Home" })
})
router.get('/addproduct', authController.protect, authController.isLoggedIn, (req, res) => {
    res.render('product', { message: "Add Product" })
})
router.get('/track', authController.protect, authController.isLoggedIn, (req, res) => {
    res.render('track', { message: "Track Product" })
})
router.get('/activity', authController.protect, authController.isLoggedIn, (req, res) => {
    res.render('activity', { message: "Track Activity" })
})
router.get('/me', authController.protect, authController.isLoggedIn, async (req, res) => {
    const activities = await require('../controllers/meController').getActivities(req.user.id_user);
    console.log(activities);
    res.render('me', { name: req.user.first_name + " " + req.user.last_name, activities })
})
module.exports = router