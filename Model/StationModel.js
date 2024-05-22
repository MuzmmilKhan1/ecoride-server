const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
      type: String,
      required: true,

    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});


const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
