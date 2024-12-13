const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const UpdateSchema= new Schema({
    name: {
        type: String,
        required: true,
    },
    version: {
        type: Number,
        unique: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Update= mongoose.model('Update', UpdateSchema);
module.exports= Update;