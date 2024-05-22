const express = require('express');
const { addStation , getStations , deleteStation, updateStation, getOneStation} = require('../Controller/stationController')
const router = express.Router();

router.post('/addstation',addStation)
router.get('/getstations',getStations)
router.route('/delete/:id').delete(deleteStation)
router.route('/update/:id').put(updateStation)
router.route('/get/:id').get(getOneStation);

module.exports = router;
