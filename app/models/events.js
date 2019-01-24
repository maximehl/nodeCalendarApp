var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    eventText: String,
    weeklyRepeat: Array,
    singleDates: Array,
    lengthEst:Number,
    eventType:String,
    userID:String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Event', eventSchema);
