const express = require('express')
const router = express.Router()
const controller = require('../controllers/productController');
const consumtionController = require('../controllers/consumtionController')
const authController = require('../controllers/authController');
router.post('/', async (req, res) => {
    const product = req.body;
    res.json(await controller.addProduct(product));
})
router.post('/consumed', authController.protect, async (req, res, next) => {
    try {
        await consumtionController.addConsumedProduct(req.user, req.body)
        res.status(200).json({ "success": "true" })
    } catch (err) {
        next(err);
    }
})
router.post('/activity', authController.protect, async (req, res, next) => {
    try {
        await consumtionController.addActivityDone(req.user, req.body)
        res.status(200).json({ "success": "true" })
    } catch (err) {
        next(err);
    }
})
router.get('/', authController.protect, async (req, res, next) => {
    try {
        res.status(200).json(await controller.getProducts(req.query.name, req.query.limit))
    } catch (err) {
        next(err);
    }
})
module.exports = router