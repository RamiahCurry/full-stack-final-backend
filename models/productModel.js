const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        email:{
            type: String,
            required: [true, "Please enter an email"]
        },
        password:{
            type: String,
            required: [true, "Please enter a password"]
        },
        phoneNumber:{
            type: String,
            required: [true, "Please enter a phone number"]
        },
        classification:{
            type: String,
            required: [true, "Please enter a classification"]
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model("Product", productSchema);

module.exports = Product