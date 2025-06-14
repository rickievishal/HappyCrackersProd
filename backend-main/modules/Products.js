const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId : {type : String, required : true },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productCost: { type: Number, required: true },
    productPrice: { type: Number, required: true },
    productContent: [
        {
            item: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    productOffer: {
        isOffer: { type: Boolean, required: true },
        offerPercent: { type: Number, required: true },
    },
    productImages: [{ type: String }] // can hold base64 strings
});

module.exports = mongoose.model('Product', productSchema);
