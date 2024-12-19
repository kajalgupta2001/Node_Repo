const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    pname : {
        type : String,
        required : true
    },
    company :{
        type : String,
        required : true
    },
    qty : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    }
})

const Product = mongoose.model('product',productSchema)

module.exports = Product