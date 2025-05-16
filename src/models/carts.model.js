import mongoose, { Schema } from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new Schema({
    products: {
        type: [{
            quantity: {
                type: Number,
                default: 0
            },
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            }
        }],
        default: []
    }
});

export default mongoose.model(cartsCollection, cartsSchema);