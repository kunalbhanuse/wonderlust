const { types, number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating:{
        type:number,
        min :1,
        max:5
    },
    createdAt: {
        type : Date,
        default : Date.now()
    }

});

module.exports =mongoose.model("Review",reviewSchema);