import mongoose, { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productsSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    stock: Number,
    code: Number,
    thumbnail: String,
});

productsSchema.plugin(mongoosePaginate)

export default mongoose.model(productsCollection, productsSchema);