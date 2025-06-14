const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userDetails: {
        userName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        userCity: { type: String, required: true },
        userAddress: { type: String, required: true },
    },
    orderDetails : {
        orderTotal : {type : Number , required : true},

        orderContent: [
        {
            productId: { type: String, required: true },
            productName: { type: String, required: true },
            productCost: { type: Number, required: true },
            productPrice: { type: Number, required: true },
            quantity: { type: Number, required: true },
            productContent : [
                { 
                    item : {type:String,required:true},
                    quantity : {type:Number,required:true}
                },
            ]
        },
        ],
        orderStatus : {
            pending : {type : Boolean,required:true},
            closed : {type : Boolean,required:true}
        },
        createdAt : {type : String,required:true}

    }

});

module.exports = mongoose.model('Order', orderSchema);
