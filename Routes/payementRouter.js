const express = require('express');
const router = express.Router();
const { processPayement, deduct } = require('../Controller/payementController');
const { body } = require('express-validator');

router.post('/payement', [
    body('amount').notEmpty().withMessage('Amount is required')
], processPayement)

router.post('/deduct', [
    body('total').notEmpty().withMessage('Total Amount is required')
], deduct)

module.exports = router;