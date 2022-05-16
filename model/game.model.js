const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    type: {
        type: String, 
        trim: true,
        default: ""
    },
    gamers: [{
        idGamer: {
            type: Schema.ObjectId,
        },
        name: {
            type: String,
            required: 'Name field is required'
        }
    }],
    inProgress: {
        type: Boolean, 
        default: true
    },
    winner: {
        type: String, 
    }
});


GameSchema.virtual('url').get(function() {
    return '/game/' + this._id;
});

module.exports = mongoose.model('Game', GameSchema);